import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import matplotlib.pyplot as plt

# ────────────────────────────────
# 📥 Cargar el dataset
# ────────────────────────────────
df = pd.read_csv("synthetic_employee_attrition_dataset_v4.csv")

# Separar variables y target
X = df.drop(columns=["Attrition"])
y = df["Attrition"]

# Escalado
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# División
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# ────────────────────────────────
# 🤖 Entrenar modelo
# ────────────────────────────────
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced")
model.fit(X_train, y_train)

# ────────────────────────────────
# 📊 Evaluar modelo
# ────────────────────────────────
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print("\n📊 Classification Report:")
print(classification_report(y_test, y_pred))
print("\n📈 ROC AUC:", roc_auc_score(y_test, y_proba))
print("\n🧮 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# ────────────────────────────────
# 📌 Importancia de variables
# ────────────────────────────────
importances = model.feature_importances_
feature_names = X.columns

feat_imp_df = pd.DataFrame({
    'Feature': feature_names,
    'Importance': importances
}).sort_values(by='Importance', ascending=False)

print("\n🔍 Top variables más importantes:")
print(feat_imp_df)

plt.figure(figsize=(10, 6))
plt.barh(feat_imp_df['Feature'][::-1], feat_imp_df['Importance'][::-1], color='steelblue')
plt.xlabel('Importancia')
plt.title('Importancia de las Variables en la Predicción de Rotación')
plt.tight_layout()
plt.show()

# ────────────────────────────────
# 👥 Empleados de prueba
# ────────────────────────────────
test_employees = pd.DataFrame([
    {'avg_monthly_hours': 160, 'late_arrivals_90d': 1, 'early_leaves_90d': 1, 'unauthorized_absences_90d': 0, 'performance_score': 75, 'job_satisfaction': 80},
    {'avg_monthly_hours': 158, 'late_arrivals_90d': 2, 'early_leaves_90d': 1, 'unauthorized_absences_90d': 1, 'performance_score': 45, 'job_satisfaction': 55},
    {'avg_monthly_hours': 130, 'late_arrivals_90d': 5, 'early_leaves_90d': 4, 'unauthorized_absences_90d': 3, 'performance_score': 40, 'job_satisfaction': 35},
    {'avg_monthly_hours': 140, 'late_arrivals_90d': 0, 'early_leaves_90d': 1, 'unauthorized_absences_90d': 0, 'performance_score': 85, 'job_satisfaction': 75},
    {'avg_monthly_hours': 150, 'late_arrivals_90d': 2, 'early_leaves_90d': 2, 'unauthorized_absences_90d': 2, 'performance_score': 60, 'job_satisfaction': 60},
    {'avg_monthly_hours': 165, 'late_arrivals_90d': 0, 'early_leaves_90d': 0, 'unauthorized_absences_90d': 0, 'performance_score': 70, 'job_satisfaction': 20},
    {'avg_monthly_hours': 125, 'late_arrivals_90d': 6, 'early_leaves_90d': 5, 'unauthorized_absences_90d': 4, 'performance_score': 30, 'job_satisfaction': 25},
    {'avg_monthly_hours': 155, 'late_arrivals_90d': 5, 'early_leaves_90d': 5, 'unauthorized_absences_90d': 3, 'performance_score': 70, 'job_satisfaction': 85},
    {'avg_monthly_hours': 170, 'late_arrivals_90d': 0, 'early_leaves_90d': 0, 'unauthorized_absences_90d': 0, 'performance_score': 90, 'job_satisfaction': 10},
    {'avg_monthly_hours': 160, 'late_arrivals_90d': 5, 'early_leaves_90d': 0, 'unauthorized_absences_90d': 5, 'performance_score': 95, 'job_satisfaction': 90},
])


# Escalar empleados de prueba
test_employees_scaled = scaler.transform(test_employees)

# Predicción
predictions = model.predict(test_employees_scaled)
probas = model.predict_proba(test_employees_scaled)[:, 1]

# Mostrar resultados
for i, (pred, prob) in enumerate(zip(predictions, probas)):
    print(f"\n👤 Empleado {i+1}: {'🔴 En riesgo' if pred == 1 else '🟢 Estable'} | Prob. rotación: {prob:.2%} | Permanencia: {1 - prob:.2%}")
