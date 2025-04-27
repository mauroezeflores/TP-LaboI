import db
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler

##conexion = db.abrir_conexion()
##rows = db.realizar_consulta(conexion, "a")
##print(rows)
##db.cerrar_conexion(conexion)

# 1. Cargar el dataset generado
df = pd.read_csv("dataset_ficticio_regresion_lineal.csv")

# 2. Definir características (X) y objetivo (y)
X = df[["nivel_de_presentismo", "nivel_de_certificacion", "nivel_de_habilidades", "presencia_en_proyectos","horas_extras","ultima_evaluacion_de_desempeño","evaluacion_del_superior"]]  # Features
y = df["puntaje_desempeño"]  # objetivo


# para que el presentismo y las horas extras no afecten tanto el resultado(si ponemos estos valores como niveles tambien entonces no haria falta)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)


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
print(f"- Intercepto (b0): {model.intercept_:.4f} (Valor real: 10)")
print(f"- Coeficiente para 'nivel_de_presentismo' (b1): {model.coef_[0]:.4f} (Valor real: n)")
print(f"- Coeficiente para 'nivel_de_certificacion' (b2): {model.coef_[1]:.4f} (Valor real: n)")
print(f"- Coeficiente para 'nivel_de_habilidades' (b3): {model.coef_[2]:.4f} (Valor real: n)")
print(f"- Coeficiente para 'presencia_en_proyectos' (b4): {model.coef_[3]:.4f} (Valor real: n)")
print(f"- Coeficiente para 'horas_extras' (b5): {model.coef_[4]:.4f} (Valor real: n)")
print(f"- Coeficiente para 'ultima_evaluacion_de_desempeno' (b6): {model.coef_[5]:.4f} (Valor real: n)")
print(f"- Coeficiente para 'evaluacion_del_superior' (b7): {model.coef_[6]:.4f} (Valor real: n)")
print(f"\nMétricas de evaluación:")
print(f"- MSE: {mse:.4f}")
print(f"- R²: {r2:.4f} (1.0 es perfecto)")
