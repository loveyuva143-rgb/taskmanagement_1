import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from typing import List, Dict, Tuple


class AIEngine:
    """
    AI-powered analytics engine for project management.
    Provides workload analysis, health prediction, and task reassignment suggestions.
    """
    
    def __init__(self):
        self.health_model = None
        self._train_health_model()
    
    def _train_health_model(self):
        """Train the project health prediction model with sample data"""
        # Sample training data
        sample_data = pd.DataFrame({
            "tasks_completed": [60, 45, 70, 30, 80, 50, 65, 40],
            "hours_worked": [38, 45, 40, 55, 35, 42, 39, 48],
            "bugs_reported": [2, 4, 1, 9, 3, 5, 2, 7],
            "project_health": ["Excellent", "Good", "Excellent", "Poor", "Excellent", "Good", "Excellent", "Fair"]
        })
        
        X = sample_data[["tasks_completed", "hours_worked", "bugs_reported"]]
        y = sample_data["project_health"]
        
        self.health_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.health_model.fit(X, y)
    
    def predict_health(self, tasks: int, hours: int, bugs: int) -> Tuple[str, float]:
        """
        Predict project health based on metrics using Random Forest Classifier.
        
        Args:
            tasks: Number of tasks completed
            hours: Hours worked
            bugs: Number of bugs reported
            
        Returns:
            Tuple of (predicted_health, confidence_score)
        """
        if self.health_model is None:
            self._train_health_model()
        
        features = np.array([[tasks, hours, bugs]])
        prediction = self.health_model.predict(features)[0]
        
        # Get probability/confidence
        probabilities = self.health_model.predict_proba(features)[0]
        max_prob = np.max(probabilities)
        
        return prediction, float(max_prob)
    
    def analyze_workload(self, metrics_data: List[Dict]) -> List[Dict]:
        """
        Analyze developer workload using Isolation Forest for anomaly detection.
        
        Args:
            metrics_data: List of dictionaries with developer metrics
            
        Returns:
            List of dictionaries with workload analysis including status and load_percentage
        """
        if not metrics_data:
            return []
        
        # Prepare data
        df = pd.DataFrame(metrics_data)
        
        # Use Isolation Forest for anomaly detection (overload detection)
        isolation = IsolationForest(contamination=0.25, random_state=42)
        preds = isolation.fit_predict(df[["hours_worked", "tasks_completed", "bugs_reported"]])
        
        results = []
        for i, metric in enumerate(metrics_data):
            status = "Overloaded" if preds[i] == -1 else "Normal"
            
            # Calculate load percentage (simplified: hours / 40 * 100)
            load_pct = (metric["hours_worked"] / 40.0) * 100 if metric["hours_worked"] > 0 else 0
            
            results.append({
                "developer": metric["developer"],
                "hours_worked": metric["hours_worked"],
                "tasks_completed": metric["tasks_completed"],
                "bugs_reported": metric["bugs_reported"],
                "status": status,
                "load_percentage": round(load_pct, 2)
            })
        
        return results
    
    def suggest_task_reassignments(self, metrics_data: List[Dict]) -> List[Dict]:
        """
        Suggest task reassignments for developers who are 120%+ loaded.
        
        Args:
            metrics_data: List of dictionaries with developer metrics
            
        Returns:
            List of reassignment suggestions
        """
        suggestions = []
        
        for metric in metrics_data:
            load_pct = (metric["hours_worked"] / 40.0) * 100
            
            if load_pct >= 120:
                # Find developers with lower load
                available_devs = [
                    m for m in metrics_data 
                    if m["developer"] != metric["developer"] 
                    and (m["hours_worked"] / 40.0) * 100 < 100
                ]
                
                if available_devs:
                    # Sort by load (ascending)
                    available_devs.sort(key=lambda x: x["hours_worked"])
                    suggested_assignee = available_devs[0]
                    
                    suggestions.append({
                        "developer": metric["developer"],
                        "current_load": round(load_pct, 2),
                        "suggested_reassignments": [
                            {
                                "from": metric["developer"],
                                "to": suggested_assignee["developer"],
                                "reason": f"Developer is {load_pct:.1f}% loaded. {suggested_assignee['developer']} has capacity."
                            }
                        ],
                        "reason": f"Overloaded at {load_pct:.1f}% capacity"
                    })
        
        return suggestions
    
    def summarize_text(self, text: str, max_sentences: int = 5) -> str:
        """
        Summarize text using extractive summarization.
        
        Args:
            text: Input text to summarize
            max_sentences: Maximum number of sentences in summary
            
        Returns:
            Summarized text
        """
        import re
        
        if not text or not text.strip():
            return ""
        
        # Split into sentences
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
        
        if len(sentences) <= max_sentences:
            return text
        
        # Score sentences (simple TF-based scoring)
        words = re.findall(r'\b\w+\b', text.lower())
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
        
        # Score sentences
        sentence_scores = {}
        for i, sentence in enumerate(sentences):
            score = sum(freq.get(word.lower(), 0) for word in sentence.split())
            sentence_scores[i] = score
        
        # Select top sentences
        sorted_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        top_indices = sorted([idx for idx, _ in sorted_sentences[:max_sentences]])
        
        # Reconstruct summary maintaining order
        summary_sentences = [sentences[idx] for idx in top_indices]
        return " ".join(summary_sentences)


# Singleton instance
ai_engine = AIEngine()
