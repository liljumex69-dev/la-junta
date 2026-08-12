# Pendientes de la revisión de seguridad (2026-08-11)

Hallazgos **documentados y deliberadamente no corregidos todavía** (decisión
del equipo: solo los 4 críticos se arreglaron — monto/remitente/normalización
en pagar_cuota y membresía en proponer). Referencias a `archivo:línea`
aproximadas a la fecha de la revisión.

## Medios

1. **Nonce congelado entre propuestas concurrentes** (`safe_exec.py`,
   `preparar_transaccion`): dos propuestas pendientes en el mismo Safe
   congelan el mismo nonce; ejecutada una, la otra queda inejecutable para
   siempre (502 en cada intento, sin endpoint de recongelado). Opciones:
   endpoint para re-preparar hash+nonce, o impedir proponer mientras haya
   otra pendiente.

2. **Firmas con v en {0,1}** (`safe_exec.py`, `recuperar_firmante`): la
   recuperación off-chain las acepta, pero el Safe on-chain interpreta v=0
   como firma de contrato (EIP-1271) y v=1 como hash aprobado → la firma se
   guarda, la ejecución revierte, y como re-firmar es no-op la propuesta
   queda atascada. Arreglo: rechazar firmas cuyo v no esté en {27, 28}.

3. **directivoId ↔ direccionFirmante sin vínculo** (`routers/propuestas.py`,
   `firmar_propuesta`): cualquier `directivoId` puede acompañar cualquier
   firma válida de owner; un mismo directivo podría enviar las firmas de
   varios owners. La autorización criptográfica es sólida, pero la
   atribución a nivel app es decorativa. Requiere decisión de producto
   (vincular wallet a la membresía — coordinar con Luis). Nota: `Usuario`
   ya tiene `direccion_wallet` para pagos de cuota; falta decidir si esa
   misma wallet identifica al firmante.

4. **Errores no tipados** (`safe_exec.py:221`, `safe_deploy.py:138`,
   `safe_exec.py:143/228`): `Account.from_key` lanza `ValueError` con una
   clave bien formada pero criptográficamente inválida (0 o >= orden de
   secp256k1), y `_contrato_safe` corre fuera de try — ambos escapan como
   500 crudos en vez de `SafeExecError`/`SafeDeploymentError`.

5. **Saldo del Safe insuficiente al ejecutar**: se atrapa vía la simulación
   `.call()` (sin gastar gas) pero con mensaje críptico. Agregar lectura
   explícita del saldo del Safe con mensaje claro.

## Calidad / eficiencia

6. **Pipeline de envío duplicado** (~45 líneas idénticas entre
   `safe_deploy.py` y `safe_exec.py`): saldo, buffer de gas, build, sign,
   send, normalización del hash, receipt, mensaje Arbiscan. Extraer un
   helper `enviar_y_esperar(...)` en `chain.py`.

7. **Reconexión Web3 por llamada** (`chain.py::conectar`): cada entrada
   reconstruye el provider y gasta 2 RPCs de validación; `firmar_propuesta`
   hace hasta 5 round-trips evitables. Cachear la instancia a nivel módulo.

8. **Simulación doble en ejecutar_transaccion**: `fn.call()` +
   `fn.estimate_gas()` ejecutan la misma simulación; `estimate_gas` ya
   falla con la razón del revert — envolver ese error y eliminar el
   `fn.call()`.

## Otros (ya señalados en la revisión)

- **`firmar_propuesta.py` está en modo debug**: imprime la clave del
  directivo y la recibe por argumento de CLI. Revertir a `getpass` antes de
  cualquier uso con claves que importen. `wallets_prueba.txt` /
  `firma_resultado.txt` contienen claves de testnet en texto plano
  (gitignorados).
- **CORS y /docs** (ver comentario `PENDIENTE-PRODUCCIÓN` en `app/main.py`):
  restringir orígenes a los dominios reales y proteger o deshabilitar
  `/docs` y `/openapi.json` en producción.
- **Vinculación de wallet por registro** (`routers/identidad.py`): hoy es
  confianza-en-el-registro; en producción exigir prueba de control (firma
  de mensaje de desafío) antes de vincular una `direccionWallet`.
