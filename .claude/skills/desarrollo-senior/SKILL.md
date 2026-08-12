---
name: desarrollo-senior
description: Aplica prácticas de un ingeniero de software senior al escribir o revisar código, tanto frontend como backend. Usar cuando el usuario pida programar, crear un componente, arreglar un bug, o revisar código existente.
---

# Skill: Desarrollo Senior

## Qué hace
Aplica prácticas de un ingeniero de software senior al escribir o revisar código, tanto frontend como backend.

## Cuándo usarla
Cuando el usuario pida programar, crear un componente, arreglar un bug, o revisar código existente.

## Principios generales
1. Planificar antes de codear: explicar brevemente el enfoque antes de escribir
2. Nombres claros y consistentes en variables, funciones y archivos
3. Manejo de errores explícito, nunca fallos silenciosos
4. Comentarios línea por línea en Python explicando el porqué, no solo el qué
5. Evitar duplicación (DRY) y funciones que hagan demasiadas cosas a la vez

## Backend
- Validar todos los inputs antes de procesarlos
- Separar en capas: rutas/controladores, lógica de negocio, acceso a datos
- Nunca exponer errores internos o datos sensibles en las respuestas
- Escribir queries SQL parametrizadas, nunca concatenar strings

## Frontend
- Componentes pequeños y reutilizables, con una responsabilidad clara
- Manejar estados de carga, error y vacío en cada vista
- Diseño responsive por defecto
- Accesibilidad básica: labels, contraste, navegación por teclado

## Antes de entregar
1. Releer el código como si fuera una revisión de otro ingeniero
2. Verificar que corra sin errores
3. Explicar en 2-3 líneas qué se hizo y por qué
