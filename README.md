# Pawfect Groom

# PROMPT — DISEÑO UX/UI DE GROOMSYNC

Quiero que diseñes la interfaz UX/UI de una aplicación web SaaS llamada **GroomSync**, enfocada exclusivamente en **peluquerías caninas pequeñas y medianas**.

GroomSync permite a las peluquerías gestionar clientes, mascotas, citas, peluqueros y controlar en tiempo real el estado de cada mascota durante su servicio.

El objetivo es crear un diseño **profesional, moderno, limpio, intuitivo y escalable**, que se sienta como un software empresarial especializado, pero manteniendo una identidad visual relacionada con el mundo de las mascotas.

## CONTEXTO DEL PRODUCTO

GroomSync se venderá mediante suscripción mensual por sucursal.

Los negocios **NO se registran por sí mismos**.

Inicialmente, el equipo de GroomSync crea la empresa, sucursal y usuarios. Los usuarios únicamente reciben sus credenciales y acceden mediante Login.

Por lo tanto:

* NO diseñar una página pública de registro para clientes.
* SÍ diseñar Login.
* SÍ diseñar recuperación de contraseña.
* El registro/creación de negocios pertenece a un panel administrativo interno de GroomSync y no forma parte de la experiencia normal del cliente.

---

# ROLES

La aplicación tendrá 3 roles principales:

## 1. DUEÑO

Es el propietario de la peluquería.

Tiene acceso completo a la información de su negocio.

Puede:

* Ver dashboard
* Gestionar clientes
* Gestionar mascotas
* Gestionar citas
* Gestionar empleados
* Gestionar servicios
* Ver estadísticas
* Ver todas las mascotas
* Ver todos los peluqueros
* Ver información general de la sucursal

---

## 2. ADMINISTRADOR / RECEPCIÓN

Se encarga de la operación diaria.

Puede:

* Registrar clientes
* Registrar mascotas
* Crear citas
* Modificar citas
* Cancelar citas
* Ver agenda
* Asignar peluqueros
* Ver estados de mascotas
* Marcar mascota como recogida
* Ver información del cliente
* Ver información de la mascota

Su interfaz debe estar enfocada en la operación diaria y ser sencilla y rápida.

---

## 3. PELUQUERO / BAÑADOR

Su interfaz debe ser mucho más simple.

Puede:

* Ver sus citas
* Ver mascotas asignadas
* Ver información de la mascota
* Ver notas importantes
* Cambiar el estado de la mascota
* Agregar observaciones
* Marcar mascota como lista
* Consultar historial diario

El peluquero NO debe tener acceso a información administrativa o financiera.

---

# FLUJO PRINCIPAL DE LA APLICACIÓN

Diseñar el flujo principal de esta manera:

Usuario inicia sesión
↓
El sistema identifica su rol
↓
Se muestra el dashboard/interfaz correspondiente
↓
El usuario trabaja según sus permisos

Flujo de una mascota:

Cliente llega
↓
Recepción registra/selecciona cliente
↓
Registra/selecciona mascota
↓
Crea o confirma cita
↓
Asigna peluquero
↓
Mascota entra al proceso
↓
Esperando
↓
Baño
↓
Secado
↓
Grooming
↓
Lista
↓
Cliente recibe notificación por WhatsApp
↓
Mascota es recogida

---

# ESTADOS DE LA CITA

Diseñar visualmente estos estados:

* Pendiente
* Confirmada
* Cancelada
* Completada

IMPORTANTE:

El estado de la cita es independiente del estado de la mascota.

---

# ESTADOS DE LA MASCOTA

Diseñar un sistema visual claro para:

⏳ Esperando
↓
🛁 Baño
↓
💨 Secado
↓
✂️ Grooming
↓
🟢 Lista
↓
🏠 Recogida

También debe existir:

⚠️ Incidencia

El estado de la mascota debe ser uno de los elementos visuales principales de la aplicación.

---

# ESTRUCTURA DE PÁGINAS

Diseña la siguiente estructura.

## PÁGINAS PÚBLICAS

### Landing Page

La landing page debe presentar GroomSync como producto SaaS para peluquerías caninas.

Debe incluir:

* Hero
* Problema
* Solución
* Beneficios
* Funcionalidades principales
* Cómo funciona
* Precio desde $49/mes por sucursal
* CTA para solicitar demo/contacto
* Footer

La landing NO debe parecer una tienda de mascotas. Debe sentirse como una empresa de software B2B.

---

### Login

Campos:

* Email
* Contraseña
* Recordarme
* Iniciar sesión
* ¿Olvidaste tu contraseña?

NO incluir botón de "Crear cuenta".

---

### Recuperar contraseña

* Email
* Enviar instrucciones
* Confirmación de envío

---

# APLICACIÓN PRIVADA

## DUEÑO

Crear páginas para:

* Dashboard
* Citas
* Clientes
* Mascotas
* Empleados
* Servicios
* Estadísticas
* Configuración

---

## ADMINISTRADOR / RECEPCIÓN

Crear páginas para:

* Dashboard operativo
* Citas
* Agenda/Calendario
* Clientes
* Mascotas

---

## PELUQUERO

Crear páginas para:

* Mis citas
* Mis mascotas
* Detalle de mascota

La navegación del peluquero debe ser mucho más reducida.

---

# DASHBOARD DEL DUEÑO

Diseñar un dashboard que permita entender el estado de la peluquería rápidamente.

Debe mostrar:

### Resumen del día

* Mascotas atendidas
* Mascotas en espera
* Mascotas en baño
* Mascotas secando
* Mascotas en grooming
* Mascotas listas
* Mascotas recogidas

### Citas

Mostrar:

* Pendientes
* Confirmadas
* Canceladas
* Completadas

### Equipo

Mostrar:

* Peluquero
* Mascotas asignadas
* Servicios realizados

### Estadísticas rápidas

* Mascotas atendidas
* Clientes nuevos
* Ingresos
* Servicios realizados

Priorizar información visual y accionable.

---

# DASHBOARD / VISTA DE RECEPCIÓN

La recepción necesita principalmente una vista operacional.

Debe poder ver rápidamente:

* Citas de hoy
* Mascotas que están esperando
* Mascotas en proceso
* Mascotas listas
* Mascotas pendientes de recoger

Debe existir un CTA visible para:

**+ Nueva cita**

Y accesos rápidos para:

**+ Nuevo cliente**

**+ Nueva mascota**

---

# INTERFAZ DEL PELUQUERO

Crear una interfaz extremadamente sencilla.

El peluquero debe poder abrir la aplicación y saber inmediatamente:

* Qué mascotas tiene asignadas
* Qué servicio realiza cada una
* En qué estado está
* Qué debe hacer a continuación

Ejemplo de tarjeta:

Mascota:
Toby

Dueño:
María Rodríguez

Servicio:
Grooming completo

Entrada:
9:00 AM

Estado:
🛁 Baño

Acción:
[ Marcar como Secado ]

Cuando marque "Lista", debe existir una confirmación visual de que se notificará al cliente por WhatsApp.

---

# CLIENTES

Diseñar:

### Lista de clientes

Mostrar:

* Nombre
* Teléfono
* Cantidad de mascotas
* Última visita
* Acciones

### Detalle del cliente

Mostrar:

* Información de contacto
* Mascotas
* Historial de citas

---

# MASCOTAS

Diseñar:

### Lista de mascotas

Mostrar:

* Foto
* Nombre
* Raza
* Dueño
* Estado actual
* Última visita

### Detalle de mascota

Mostrar:

* Foto
* Nombre
* Raza
* Sexo
* Peso
* Dueño
* Observaciones
* Historial

Mostrar claramente el estado actual cuando tenga una cita activa.

---

# CITAS

Diseñar:

### Vista calendario

Permitir visualizar las citas por:

* Día
* Semana

Mostrar:

* Hora
* Mascota
* Servicio
* Peluquero
* Estado

### Crear/editar cita

Campos:

* Cliente
* Mascota
* Servicio
* Fecha
* Hora
* Peluquero
* Precio
* Observaciones

---

# EMPLEADOS

Para el dueño:

Lista de empleados.

Mostrar:

* Nombre
* Rol
* Estado
* Mascotas asignadas
* Servicios realizados

Acciones:

* Crear
* Editar
* Activar
* Desactivar

---

# SERVICIOS

Diseñar una sección donde el dueño pueda gestionar:

* Nombre
* Descripción
* Precio
* Duración estimada
* Estado

Ejemplos:

* Baño
* Grooming
* Baño + Grooming
* Corte de uñas

---

# ESTADÍSTICAS

Diseñar una página sencilla con:

* Mascotas atendidas
* Citas completadas
* Cancelaciones
* Clientes nuevos
* Ingresos
* Servicios más utilizados
* Servicios realizados por peluquero

Utilizar gráficos simples y fáciles de entender.

No sobrecargar la interfaz.

---

# NOTIFICACIÓN WHATSAPP

Cuando una mascota cambie a:

🟢 LISTA

Mostrar una confirmación visual:

"Notificación enviada al cliente"

La interfaz debe comunicar claramente que el cliente será avisado para recoger a su mascota.

---

# NAVEGACIÓN

Crear navegación específica por rol.

## Dueño

Sidebar:

* Dashboard
* Citas
* Mascotas
* Clientes
* Empleados
* Servicios
* Estadísticas
* Configuración

## Administrador

Sidebar:

* Dashboard
* Citas
* Agenda
* Mascotas
* Clientes

## Peluquero

Sidebar:

* Mis citas
* Mis mascotas

La navegación debe ser consistente y fácil de entender.

---

# COMPONENTES

Crear un sistema de componentes reutilizables.

Necesito componentes para:

* Sidebar
* Header
* Topbar
* Cards
* Buttons
* Inputs
* Selects
* Modals
* Dropdowns
* Tables
* Badges
* Status badges
* Alerts
* Toast notifications
* Calendar
* Appointment cards
* Pet cards
* Customer cards
* Employee cards
* Service cards
* Statistics cards
* Charts
* Empty states
* Loading states
* Error states
* Confirmation dialogs
* Pagination
* Search
* Filters

Los componentes deben ser reutilizables entre las diferentes páginas y roles.

---

# SISTEMA VISUAL

Crear un Design System para GroomSync.

## Personalidad visual

* Profesional
* Moderno
* Limpio
* Amigable
* Confiable
* Tecnológico
* Especializado en mascotas

Evitar un diseño infantil o excesivamente "cute".

Debe parecer un producto SaaS profesional.

---

# COLORES

Crear una paleta principal y secundaria.

Utilizar:

* Color primario
* Color secundario
* Background
* Surface
* Text primary
* Text secondary
* Border
* Success
* Warning
* Error
* Info

Los estados de las mascotas deben poder diferenciarse visualmente.

---

# TIPOGRAFÍA

Elegir una tipografía moderna, legible y profesional.

Definir:

* H1
* H2
* H3
* Body
* Caption
* Button
* Labels

---

# ICONOGRAFÍA

Utilizar iconos simples y consistentes.

Preferir iconografía relacionada con:

* Mascotas
* Calendario
* Usuarios
* Servicios
* Estadísticas
* Configuración
* Notificaciones

No abusar de emojis.

Los emojis pueden utilizarse únicamente como apoyo visual puntual.

---

# DISEÑO RESPONSIVE

Diseñar Mobile First.

La aplicación debe funcionar correctamente en:

### Desktop

1440px
1280px

### Tablet

768px

### Mobile

375px
390px
430px

En mobile:

* Sidebar debe convertirse en menú/drawer.
* Tablas deben adaptarse o convertirse en cards.
* Dashboard debe reorganizarse verticalmente.
* Los botones principales deben ser fáciles de tocar.
* Las tarjetas de mascotas deben ser legibles.
* El cambio de estado de una mascota debe ser extremadamente fácil.

---

# UX

Priorizar velocidad y facilidad de uso.

La recepción y los peluqueros estarán utilizando el sistema mientras trabajan.

Por lo tanto:

* Reducir cantidad de clics.
* Evitar formularios innecesariamente largos.
* Mostrar acciones principales claramente.
* Mantener información importante visible.
* Utilizar estados visuales claros.
* Evitar pantallas sobrecargadas.

El flujo más importante es:

**Registrar → Asignar → Atender → Actualizar estado → Notificar → Recoger**

---

# MULTI-SUCURSAL

El sistema debe estar preparado para empresas con múltiples sucursales.

En la interfaz del dueño puede existir un selector:

**Sucursal: [ Costa del Este ▼ ]**

Pero NO es necesario desarrollar un dashboard corporativo complejo en este MVP.

La arquitectura visual debe permitir agregarlo posteriormente.

---

# IMPORTANTE: ALCANCE DEL MVP

NO inventar funcionalidades adicionales.

No diseñar como parte del MVP:

* App móvil nativa
* Pagos online
* Programa de fidelización
* Inventario
* Facturación
* IA
* Marketing automatizado
* Portal completo del cliente
* Reservas online avanzadas
* Funcionalidades sociales

Estas pueden quedar fuera del diseño actual.

---

# ENTREGABLES

Quiero que generes el diseño completo de UX/UI y lo organices en:

## 01. Sitemap

Mostrar todas las páginas y su jerarquía.

## 02. User Flow

Mostrar los flujos principales de:

* Dueño
* Administrador
* Peluquero

## 03. Wireframes

Diseñar las estructuras principales antes de aplicar el sistema visual.

## 04. Design System

Definir:

* Colores
* Tipografía
* Espaciado
* Bordes
* Sombras
* Botones
* Inputs
* Cards
* Badges
* Estados
* Iconos

## 05. High Fidelity UI

Diseñar las pantallas principales completamente.

## 06. Responsive

Mostrar cómo se adapta cada pantalla a:

* Desktop
* Tablet
* Mobile

## 07. Component Library

Crear componentes reutilizables.

## 08. Prototipo

Conectar los principales flujos:

Login
→ Dashboard
→ Citas
→ Mascota
→ Cambio de estado
→ Mascota lista
→ Confirmación de WhatsApp

---

# OBJETIVO FINAL

El resultado debe ser un diseño que pueda ser entregado directamente a un equipo de desarrollo Frontend y Backend.

No quiero únicamente pantallas bonitas.

Quiero una **estructura UX/UI completa, consistente y preparada para desarrollo**, donde cada rol tenga claramente definidas sus páginas, permisos y acciones.

GroomSync debe sentirse como un producto SaaS real que una peluquería canina estaría dispuesta a pagar mensualmente.

El color principal debe ser #6B4DAB

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f7e2457-c84d-4ef0-89bd-ccfdaf328798).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
