import re
from typing import List


class NLPService:
    """
    Simple NLP service for text summarization without external API keys.
    Uses extractive summarization based on sentence scoring.
    """
    
    @staticmethod
    def summarize_text(text: str, max_sentences: int = 5) -> str:
        """
        Summarize text using extractive summarization.
        
        Args:
            text: Input text to summarize
            max_sentences: Maximum number of sentences in summary
            
        Returns:
            Summarized text
        """
        if not text or not text.strip():
            return ""
        
        # Split into sentences
        sentences = NLPService._split_sentences(text)
        
        if len(sentences) <= max_sentences:
            return text
        
        # Score sentences (simple TF-based scoring)
        word_freq = NLPService._calculate_word_frequency(text)
        sentence_scores = {}
        
        for i, sentence in enumerate(sentences):
            score = sum(word_freq.get(word.lower(), 0) for word in sentence.split())
            sentence_scores[i] = score
        
        # Select top sentences
        sorted_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        top_indices = sorted([idx for idx, _ in sorted_sentences[:max_sentences]])
        
        # Reconstruct summary maintaining order
        summary_sentences = [sentences[idx] for idx in top_indices]
        return " ".join(summary_sentences)
    
    @staticmethod
    def _split_sentences(text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting (can be improved with NLTK if needed)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    @staticmethod
    def _calculate_word_frequency(text: str) -> dict:
        """Calculate word frequency in text"""
        # Remove punctuation and convert to lowercase
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Remove common stop words (simple list)
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
        }
        
        words = [w for w in words if w not in stop_words and len(w) > 2]
        
        # Calculate frequency
        freq = {}
        for word in words:
            freq[word] = freq.get(word, 0) + 1
        
        return freq


nlp_service = NLPService()

