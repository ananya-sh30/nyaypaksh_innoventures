import os
import numpy as np
from flask import Blueprint, request, jsonify
from transformers import pipeline, GPT2TokenizerFast
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain.docstore.document import Document
import faiss


chatbot_bp = Blueprint('chatbot', __name__)

tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")


def count_tokens(text: str) -> int:
    return len(tokenizer.encode(text))

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=24,
    length_function=count_tokens,
)


embedding_model = SentenceTransformer('all-MiniLM-L6-v2')  


def create_embeddings_and_vector_store(context):
  
    chunks = text_splitter.create_documents([context])


    embeddings = [embedding_model.encode(chunk.page_content) for chunk in chunks]
    embeddings = np.array(embeddings, dtype=np.float32)  

 
    dimension = embeddings.shape[1]  
    index = faiss.IndexFlatL2(dimension) 
    index.add(embeddings)  

  
    index_to_docstore_id = {i: i for i in range(len(chunks))}
    docstore = InMemoryDocstore({
        i: Document(page_content=chunk.page_content) for i, chunk in enumerate(chunks)
    })

    
    db = FAISS(embeddings, index, docstore, index_to_docstore_id)
    return db


def retrieve_context(query, db, k=3):
    query_embedding = embedding_model.encode(query)
    docs = db.similarity_search_by_vector(query_embedding, k=k)
    combined_context = " ".join([doc.page_content for doc in docs])
    return combined_context

# Step 6: Enhanced QA Model Setup
qa_model = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

# Step 7: Answering Function (Returning Answer as Text)
def get_answer(query, db):
    # Retrieve broader context
    context = retrieve_context(query, db, k=3)

    # Run QA model
    result = qa_model(question=query, context=context)

    # Augment answer with additional context
    augmented_answer = f"{result['answer']}\n\n\n{context[:300]}"  # Append top part of the context.
    
    return augmented_answer
# API route for asking questions
@chatbot_bp.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()  # Receive data from the frontend
        question = data.get('question')
        text = data.get('context')

        if not question or not text:
            return jsonify({"error": "Missing question or context"}), 400

        # Create embeddings and vector store for the provided context
        db = create_embeddings_and_vector_store(text)

        # Get the answer from the QA model
        answer = get_answer(question, db)

        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        # Return error if something goes wrong
        return jsonify({"error": str(e)}), 500
