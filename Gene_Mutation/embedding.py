import json
import torch
import numpy as np
import pandas as pd
from transformers import BertTokenizer, BertModel
import warnings

warnings.filterwarnings("ignore")


class MultimodalPatientEmbedder:
    def __init__(self, device="cpu"):
        self.device = device
        print("device:", self.device)

        self.tokenizer = BertTokenizer.from_pretrained("dmis-lab/biobert-v1.1")
        self.model = BertModel.from_pretrained("dmis-lab/biobert-v1.1").to(self.device)
        self.model.eval()

        self.k = 3
        self.nucleotides = ["A", "T", "G", "C"]
        self.kmers = self._kmers(self.k)
        self.kmer_idx = {k: i for i, k in enumerate(self.kmers)}

    def _kmers(self, k):
        if k == 1:
            return self.nucleotides
        return [p + n for p in self._kmers(k - 1) for n in self.nucleotides]

    def encode_text(self, texts, batch_size=16):
        vectors = []

        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            inputs = self.tokenizer(
                batch,
                padding=True,
                truncation=True,
                max_length=128,
                return_tensors="pt"
            ).to(self.device)

            with torch.no_grad():
                out = self.model(**inputs)
                cls = out.last_hidden_state[:, 0, :]

            vectors.append(cls.cpu().numpy())

        return np.vstack(vectors)

    def encode_dna(self, dna_lists):
        out = []

        for seqs in dna_lists:
            if not seqs:
                out.append(np.zeros(len(self.kmers)))
                continue

            seq_vecs = []
            for seq in seqs:
                v = np.zeros(len(self.kmers))
                for i in range(len(seq) - self.k + 1):
                    kmer = seq[i:i + self.k]
                    if kmer in self.kmer_idx:
                        v[self.kmer_idx[kmer]] += 1
                if v.sum() > 0:
                    v /= v.sum()
                seq_vecs.append(v)

            out.append(np.mean(seq_vecs, axis=0))

        return np.array(out)

    def encode_pathways(self, pathways):
        all_p = sorted({p for lst in pathways for p in lst})
        idx = {p: i for i, p in enumerate(all_p)}

        emb = np.zeros((len(pathways), len(all_p)))
        for i, plist in enumerate(pathways):
            for p in plist:
                emb[i, idx[p]] = 1

        return emb

    def encode_numeric(self, numeric):
        df = pd.DataFrame(numeric)
        for c in df.columns:
            std = df[c].std()
            if std > 0:
                df[c] = (df[c] - df[c].mean()) / std
            else:
                df[c] = 0
        return df.values

    def embed(self, patients):
        print("text")
        t = self.encode_text([p["Text"] for p in patients])

        print("dna")
        d = self.encode_dna([p["DNA"] for p in patients])

        print("pathways")
        p = self.encode_pathways([p["Pathways"] for p in patients])

        print("numeric")
        n = self.encode_numeric([p["Numeric"] for p in patients])

        emb = np.concatenate([t, d, p, n], axis=1).astype(np.float32)
        print("final shape:", emb.shape)
        return emb


if __name__ == "__main__":
    device = "cuda" if torch.cuda.is_available() else "cpu"
    embedder = MultimodalPatientEmbedder(device)

    with open("patient_chunks.json") as f:
        patients = json.load(f)

    emb = embedder.embed(patients)
    emb = np.nan_to_num(emb)

    np.save("patient_embeddings.npy", emb)
