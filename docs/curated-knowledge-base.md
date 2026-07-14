# Curated Knowledge Base for BMC AI

This plan explains how BMC AI can use curated books, papers, internal notes, and case studies as a controlled knowledge base for the agentic AI workflow.

## Goal

The app should not only generate a generic Business Model Canvas. It should answer with guidance grounded in curated BMC references, entrepreneurship papers, Indonesian SME context, case studies, and internal consulting playbooks.

## Recommended Architecture

Use Retrieval-Augmented Generation (RAG) plus an agentic review pipeline.

1. Knowledge ingestion
   - Admin uploads PDF, DOCX, TXT, Markdown, or web article snapshots.
   - Extract text using `pdf-parse` for digital PDFs, OCR for scanned PDFs, `mammoth` for DOCX, and plain parsers for TXT/MD.
   - Store source metadata: title, author, year, publisher/journal, license/usage rights, language, tags, BMC block, page/chapter, and curator notes.

2. Curation layer
   - Do not index every document blindly.
   - A human curator marks which chunks are approved, which are excluded, and which are only for internal reasoning.
   - Add tags such as `customer-segments`, `value-proposition`, `unit-economics`, `go-to-market`, `tourism`, `umkm`, `validation`, and `pricing`.

3. Chunking
   - Split documents into 600-1,000 token chunks with 80-150 token overlap.
   - Preserve page number, section heading, source ID, and citation data.
   - Avoid long verbatim chunks in the final answer; the model should summarize and cite rather than reproduce copyrighted text.

4. Embeddings and vector storage
   - Use a vector database such as Supabase/Postgres `pgvector`, Qdrant, or Pinecone.
   - Suggested tables:
     - `knowledge_sources`: source metadata and file location.
     - `knowledge_chunks`: chunk text, embedding, source ID, page/section, tags, language, approval status.
     - `knowledge_runs`: logs of which chunks were retrieved for each BMC/chat response.

5. Retrieval at generation time
   - When user submits an idea, classify the idea by sector, language, location, and BMC blocks.
   - Retrieve top chunks for the full idea plus targeted chunks for important BMC blocks.
   - Prefer approved chunks and matching language, but allow cross-language references if useful.
   - Include compact citations in the AI prompt: source title, page/section, and short summary.

6. Agentic workflow
   - Planner agent: identifies user business type, missing context, and likely BMC blocks that need expert grounding.
   - Retriever agent: searches the curated knowledge base and returns the most relevant chunks with citations.
   - BMC writer agent: drafts the 9 blocks using user context plus retrieved knowledge.
   - Risk critic agent: checks risky assumptions, unit economics, and validation experiments.
   - Citation checker agent: ensures any claim based on the knowledge base has a source reference and no long copyrighted excerpt.
   - Finalizer agent: produces concise BMC output in the selected language.

## API Shape

Suggested backend endpoints:

- `POST /api/knowledge/upload`
  Upload a document and metadata. Admin only.

- `GET /api/knowledge/sources`
  List curated sources, filter by tags/language/status.

- `POST /api/knowledge/search`
  Search approved chunks by query, BMC block, sector, and language.

- `POST /api/bmc/generate`
  Existing endpoint, enhanced to retrieve knowledge before calling the model.

- `POST /api/bmc/chat`
  Existing endpoint, enhanced to retrieve relevant chunks for the user question.

## Prompt Contract

The model should receive only the most relevant summaries and short excerpts. A safe prompt format:

```json
{
  "userIdea": "...",
  "language": "id/en",
  "retrievedKnowledge": [
    {
      "source": "Book or paper title",
      "page": "p. 42",
      "tags": ["value-proposition", "validation"],
      "summary": "Curator-approved summary of the useful idea.",
      "allowedExcerpt": "Optional short excerpt only when rights allow."
    }
  ],
  "requiredOutput": "BMC JSON contract"
}
```

## Copyright and Safety Notes

- Store and use books/papers only if the team has the right to process them.
- Final AI output should summarize insights and cite sources, not reproduce long passages.
- Keep uploaded documents private unless the license explicitly permits sharing.
- Log retrieved chunks for auditability, especially if the app becomes paid.

## Practical First Version

For the first implementation, use Postgres + `pgvector` because it can store metadata, user accounts, and vectors in one database.

Minimum build:

1. Admin-only upload form for PDF/DOCX/TXT.
2. Text extraction and manual approval screen.
3. Embedding job for approved chunks.
4. Retrieval helper inside `generateBmc` and `chatBmc`.
5. Citations shown under AI answers as `Sources used`.

This will make BMC AI feel more like a trained business assistant: it can reference curated frameworks, explain why a recommendation is made, and adapt examples to Indonesian SMEs or global founders.