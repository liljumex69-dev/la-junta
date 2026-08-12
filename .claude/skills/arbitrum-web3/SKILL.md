---
name: arbitrum-web3
description: Aplica buenas prácticas de desarrollo Web3 sobre Arbitrum, específicamente para proyectos que usan Safe (custodia), Stylus (contratos en Rust) y puentes fiat-stablecoin. Usar cuando el usuario trabaje en contratos inteligentes, integración con Safe, backend que conecta pagos en soles/fiat con USDC, o cualquier código relacionado a Arbitrum Sepolia u Arbitrum One.
---

# Skill: Arbitrum Web3

## Qué hace
Aplica buenas prácticas de desarrollo Web3 sobre Arbitrum, específicamente para proyectos que usan Safe (custodia), Stylus (contratos en Rust) y puentes fiat-stablecoin.

## Cuándo usarla
Cuando el usuario trabaje en contratos inteligentes, integración con Safe, backend que conecta pagos en soles/fiat con USDC, o cualquier código relacionado a Arbitrum Sepolia u Arbitrum One.

## Principios
1. Nunca reinventar custodia multi-firma propia — usar Safe siempre que sea posible
2. Contratos Stylus en Rust para lógica que se repite mucho (cálculos de cumplimiento, cuotas) por su costo de gas mucho menor que Solidity puro
3. Nunca exponer claves privadas ni secretos en código o logs
4. Todo movimiento de fondos debe quedar verificable públicamente (eventos indexables, visibles en Arbiscan)
5. Validar montos y direcciones antes de cualquier transacción on-chain
6. Separar claramente: lógica de negocio (backend) vs lógica de custodia (Safe) vs lógica de cálculo (Stylus)

## Stack de referencia (proyecto JUNTA)
- Red: Arbitrum Sepolia (testnet, gratis vía faucet)
- Custodia: Safe (multi-firma)
- Rendimiento: Aave (protocolo de préstamos)
- Contrato de cumplimiento: Stylus (Rust/C/C++ compilado a WebAssembly)
- Backend: FastAPI o Node
- Verificación: Arbiscan

## Para demos con tiempo limitado
Si el tiempo aprieta, es válido simular partes no críticas (ej. rendimiento de Aave) mientras la lógica core (registro de pagos, estado de cumplimiento) sea real. Siempre ser honesto en el código/comentarios sobre qué está simulado y qué es real.
