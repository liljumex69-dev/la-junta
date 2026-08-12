# Arquitectura de Junta

Junta es una tesorería digital colectiva diseñada para asociaciones de comerciantes, operando en la blockchain de Arbitrum. Su arquitectura está dividida en tres capas principales diseñadas para garantizar la seguridad de los fondos, la transparencia y la facilidad de uso.

## Diagrama de Arquitectura

```mermaid
graph TD
    subgraph "Capa de Presentación (Interfaz)"
        UI[Next.js + Tailwind + shadcn/ui]
        Context[React Context (Estado Global)]
        UI --> Context
    end

    subgraph "Capa de Lógica de Negocio (Smart Contracts)"
        Stylus[Arbitrum Stylus]
        Reglas[Reglas: Mora, Historial, Cuotas]
        Stylus --> Reglas
    end

    subgraph "Capa de Custodia (Seguridad)"
        Safe[Safe / Gnosis Safe]
        Multisig[Firma Múltiple / Umbral]
        Safe --> Multisig
    end

    Context -.->|Lee/Escribe estado| Stylus
    Stylus -.->|Propone/Ejecuta transacciones| Safe
    
    User((Usuario)) --> UI
```

## 1. Interfaz (Frontend)
Construida para ser accesible y familiar para usuarios no técnicos. Oculta completamente la complejidad de la blockchain.
- **Tecnologías:** Next.js, TypeScript, Tailwind CSS, shadcn/ui.
- **Estado actual:** Prototipo funcional con simulación de estado en memoria (React Context) sin persistencia de base de datos.
- **Integración futura:** Esta capa se conectará a los contratos de Stylus y a Safe utilizando bibliotecas como `viem` o `wagmi`, manteniendo la misma estructura de componentes diseñada en Scaffold-ETH.

## 2. Lógica de Negocio (Arbitrum Stylus)
Maneja las reglas específicas de la asociación de comerciantes.
- **Responsabilidades:** 
  - Llevar el registro de los pagos de cuotas.
  - Administrar la creación de propuestas de gasto.
  - Registrar el historial de cumplimiento por puesto.
  - Aplicar reglas configurables de la asociación (ej. tasas de mora, umbrales requeridos).
- **Ventaja de Stylus:** Permite escribir contratos inteligentes altamente eficientes en lenguajes como Rust, C o C++, reduciendo los costos de transacción (gas) en Arbitrum.

## 3. Custodia (Safe - Gnosis Safe)
El núcleo de seguridad para el fondo común. Asegura que el dinero nunca dependa de una sola persona.
- **Funcionamiento:** Cada asociación despliega su propio contrato Safe en Arbitrum.
- **Firma Múltiple (Multisig):** Los directivos son los firmantes. Se configura un umbral (por ejemplo, 3 de 5 directivos deben firmar) para que cualquier movimiento de fondos se ejecute.
- **Ejecución:** Una vez que una propuesta de gasto en el contrato Stylus alcanza el umbral de firmas necesario, la transacción se envía a Safe para liberar los fondos.

---
*Nota para integración: Los puntos de conexión con Safe y Stylus están marcados en el código fuente de la interfaz con el comentario `// TODO: conectar a Safe/smart contract`.*
