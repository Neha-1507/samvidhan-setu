# Phase 2 plan: how the Legal AI will work

Now (steps 15-17):   question -> BM25 retriever -> matching provisions + source + disclaimer
Next:                add Bare Acts (BNS, BNSS, BSA) as more documents in the same retriever
Then:                embeddings + Qdrant (handles Hindi/Hinglish properly), keep BM25 as a hybrid
Then:                LLM writes a plain answer ONLY from retrieved text, must cite article numbers
Rule:                nothing retrieved -> say "not found", never guess
