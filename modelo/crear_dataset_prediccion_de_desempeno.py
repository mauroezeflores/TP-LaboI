import numpy as np
import pandas as pd

# Coeficientes de la regresión lineal (en base a los porcentajes asignados)
b0 = 10         # Intercepto (7.5%)
b1 = 6.75       # Coeficiente para presentismo (7.5%)
b2 = 0.54       # Coeficiente para nivel de certificación (15%)
b3 = 0.54       # Coeficiente para nivel de habilidades (15%)
b4 = 0.54       # Coeficiente para presencia en proyectos (15%)
b5 = 4.5        # Coeficiente para horas extras (5%)
b6 = 0.18       # Coeficiente para última evaluación de desempeño (20%)
b7 = 0.18       # Coeficiente para evaluación del superior (20%)


# Número de empleados para el dataset ficticio
employees = 100000

# Inicializar dataset
dataset = np.zeros((employees, 9))


# Generar datos
for i in range(employees):
    nivel_de_presentismo = np.random.choice([0, 1])                         # True/False --> 0 o 1
    nivel_certificacion = np.random.randint(1, 26)                 # 1 a 25
    nivel_habilidades = np.random.randint(1, 26)                   # 1 a 25
    presencia_en_proyectos = np.random.randint(1, 26)              # 1 a 25
    horas_extras = np.random.choice([0, 1])                        # True/False --> 0 o 1
    ultima_eval_desempeño = np.random.randint(1, 101)              # 1 a 100
    evaluacion_del_superior = np.random.randint(1, 101)            # 1 a 100

    # Ruido normal pequeño
    ruido = np.random.normal(0, 1.5)

    # Calcular puntaje de desempeño
    y = (b0 + b1 * nivel_de_presentismo + b2 * nivel_certificacion + b3 * nivel_habilidades +
         b4 * presencia_en_proyectos + b5 * horas_extras + 
         b6 * ultima_eval_desempeño + b7 * evaluacion_del_superior + ruido)

    # Limitar el puntaje entre [10, 100]
    y = max(10, min(100, y))

    # Guardar valores en dataset
    dataset[i] = [i, nivel_de_presentismo, nivel_certificacion, nivel_habilidades, presencia_en_proyectos, horas_extras, ultima_eval_desempeño, evaluacion_del_superior, y]

# Convertir el array a un DataFrame
df = pd.DataFrame(dataset, columns=[
    "id", "nivel_de_presentismo", "nivel_de_certificacion", "nivel_de_habilidades", 
    "presencia_en_proyectos", "horas_extras", "ultima_evaluacion_de_desempeño", 
    "evaluacion_del_superior", "puntaje_desempeño"
])

 

# Convertir columnas a tipos correctos
df["id"] = df["id"].astype(int)
df["nivel_de_presentismo"] = df["nivel_de_presentismo"].astype(bool)
df["nivel_certificacion"] = df["nivel_de_certificacion"].astype(int)
df["nivel_habilidades"] = df["nivel_de_habilidades"].astype(int)
df["presencia_en_proyectos"] = df["presencia_en_proyectos"].astype(int)
df["horas_extras"] = df["horas_extras"].astype(bool)
df["ultima_evaluacion_de_desempeño"] = df["ultima_evaluacion_de_desempeño"].astype(int)
df["ultima_evaluacion_desempeño"] = df["evaluacion_del_superior"].astype(int)

# Guardar a CSV
df.to_csv("dataset_prediccion_de_desempeno.csv", index=False)

print("Dataset guardado como 'dataset_prediccion_de_desempeno.csv'")
