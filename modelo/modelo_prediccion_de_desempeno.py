import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import seaborn as sns
import matplotlib.pyplot as plt
from joblib import dump

# 1. Cargar el dataset generado
df = pd.read_csv("dataset_prediccion_de_desempeno.csv")

# 2. Definir características (X) y objetivo (y)
X = df[["nivel_de_presentismo", "nivel_certificacion", "nivel_habilidades", "presencia_en_proyectos", "horas_extras", "ultima_evaluacion_desempeño", "evaluacion_del_superior"]]
y = df["puntaje_desempeño"]  # objetivo

# 3. Dividir en train (80%) y test (20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Crear y entrenar el modelo
model = LinearRegression()
model.fit(X_train, y_train)

# 5. Predecir en el conjunto de test
y_pred = model.predict(X_test)

# 6. Calcular MSE y R^2
mse = mean_squared_error(y_test, y_pred)
r2 = model.score(X_test, y_test)

# 7. Mostrar resultados
print("\nResultados del modelo:")
print(f"- Intercepto (b0): {model.intercept_:.4f}")
for feature, coef in zip(X.columns, model.coef_):
    print(f"- Coeficiente para '{feature}': {coef:.4f}")
print("\nMétricas de evaluación:")
print(f"- MSE: {mse:.4f}")
print(f"- R²: {r2:.4f} (1.0 es perfecto)")

#################################
####EXPORTAR MODELO PARA USAR####
#################################
dump(model, 'modelo_prediccion_de_desempeno.joblib')

#############################
####GRAFICO DE DISPERSIÓN####
#############################
plt.figure(figsize=(10, 6))
sns.scatterplot(x=y_test, y=y_pred, color='blue', alpha=0.5)
sns.regplot(x=y_test, y=y_pred, scatter=False, color='red')

plt.xlabel("Valores reales")
plt.ylabel("Valores de predicción")
plt.title("Valores reales vs Valores de predicción")
plt.show()

############################
#####PREDICCION EMPLEADO####
############################

nuevo_empleado = pd.DataFrame({
    "nivel_de_presentismo": [1],
    "nivel_certificacion": [22],
    "nivel_habilidades": [5],
    "presencia_en_proyectos": [15],
    "horas_extras": [0],
    "ultima_evaluacion_desempeño": [88],
    "evaluacion_del_superior": [90]
})

# Predecir su puntaje de desempeño
puntaje_predicho = model.predict(nuevo_empleado)
print(f"\nPuntaje predicho para el nuevo empleado: {puntaje_predicho[0]:.2f}")


