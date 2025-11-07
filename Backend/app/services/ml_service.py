import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sqlalchemy.orm import Session
from app.models import DeveloperMetrics
from typing import List, Dict, Tuple


class MLService:
    def __init__(self):
        self.health_model = None
        self.isolation_model = None
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
        Predict project health based on metrics
        
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
    
    def analyze_workload(self, db: Session) -> List[Dict]:
        """
        Analyze developer workload using Isolation Forest
        
        Returns:
            List of dictionaries with workload analysis
        """
        # Fetch all metrics
        metrics = db.query(DeveloperMetrics).all()
        
        if not metrics:
            return []
        
        # Prepare data
        data = []
        for metric in metrics:
            data.append({
                "developer": metric.developer_name,
                "hours_worked": metric.hours_worked,
                "tasks_completed": metric.tasks_completed,
                "bugs_reported": metric.bugs_reported
            })
        
        df = pd.DataFrame(data)
        
        # Use Isolation Forest for anomaly detection (overload detection)
        isolation = IsolationForest(contamination=0.25, random_state=42)
        preds = isolation.fit_predict(df[["hours_worked", "tasks_completed", "bugs_reported"]])
        
        # Calculate load percentage (normalized score)
        features_normalized = (df[["hours_worked", "tasks_completed", "bugs_reported"]] - 
                              df[["hours_worked", "tasks_completed", "bugs_reported"]].mean()) / \
                             (df[["hours_worked", "tasks_completed", "bugs_reported"]].std() + 1e-6)
        
        results = []
        for i, metric in enumerate(metrics):
            status = "Overloaded" if preds[i] == -1 else "Normal"
            
            # Calculate load percentage (simplified: hours / 40 * 100)
            load_pct = (metric.hours_worked / 40.0) * 100 if metric.hours_worked > 0 else 0
            
            results.append({
                "developer": metric.developer_name,
                "hours_worked": metric.hours_worked,
                "tasks_completed": metric.tasks_completed,
                "bugs_reported": metric.bugs_reported,
                "status": status,
                "load_percentage": round(load_pct, 2)
            })
        
        return results
    
    def suggest_task_reassignments(self, db: Session) -> List[Dict]:
        """
        Suggest task reassignments for developers who are 120%+ loaded
        
        Returns:
            List of reassignment suggestions
        """
        metrics = db.query(DeveloperMetrics).all()
        
        if not metrics:
            return []
        
        suggestions = []
        
        for metric in metrics:
            load_pct = (metric.hours_worked / 40.0) * 100
            
            if load_pct >= 120:
                # Find developers with lower load
                available_devs = [
                    m for m in metrics 
                    if m.developer_id != metric.developer_id 
                    and (m.hours_worked / 40.0) * 100 < 100
                ]
                
                if available_devs:
                    # Sort by load (ascending)
                    available_devs.sort(key=lambda x: x.hours_worked)
                    suggested_assignee = available_devs[0]
                    
                    suggestions.append({
                        "developer": metric.developer_name,
                        "current_load": round(load_pct, 2),
                        "suggested_reassignments": [
                            {
                                "from": metric.developer_name,
                                "to": suggested_assignee.developer_name,
                                "reason": f"Developer is {load_pct:.1f}% loaded. {suggested_assignee.developer_name} has capacity."
                            }
                        ],
                        "reason": f"Overloaded at {load_pct:.1f}% capacity"
                    })
        
        return suggestions


ml_service = MLService()

