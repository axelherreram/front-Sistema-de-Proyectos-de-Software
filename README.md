# Frontend del Sistema de Proyectos de Software

Este es el frontend del sistema de gestión de proyectos de software. Está desarrollado en **React** y permite a los usuarios visualizar, administrar y monitorear los proyectos, módulos y fases de desarrollo mediante una interfaz intuitiva y gráficos interactivos.

---

## Estructura del Proyecto

La estructura principal del frontend está organizada de la siguiente manera:

- **/src**
  - **/components**: Componentes reutilizables que se utilizan en diferentes partes de la aplicación, como `CardDataStats` para las tarjetas de estadísticas, y componentes de gráficos como `ChartOne`.
  - **/pages**: Contiene las páginas principales de la aplicación, como `Dashboard`, `ECommerce`, entre otras.
  - **/layout**: Plantillas de diseño que definen la estructura general de la interfaz, incluyendo encabezados, pies de página y barras laterales.
  - **/services**: Define las conexiones a las APIs y contiene la lógica para hacer peticiones HTTP.
  - **/styles**: Archivos de estilos CSS y configuraciones de diseño que se aplican globalmente a la aplicación.
  - **App.tsx**: Archivo principal donde se configuran las rutas y se monta la aplicación.
  - **index.tsx**: Punto de entrada del proyecto donde se inicia la aplicación y se aplica el renderizado de React.

---

## Arquitectura de la Aplicación

El frontend sigue una arquitectura basada en **componentes** y **rutas**. Utiliza los siguientes principios y tecnologías:

- **React + TypeScript**: Para asegurar un desarrollo con tipos y una mayor robustez en el código.
- **React Router**: Para la gestión de rutas y navegación entre las diferentes vistas de la aplicación.
- **Hooks de React**: Para manejar el estado y los efectos secundarios de manera eficiente.
- **ApexCharts**: Librería de gráficos utilizada para mostrar estadísticas visuales y métricas en el dashboard.
- **Diseño Responsivo**: La aplicación está optimizada para dispositivos móviles y de escritorio usando Tailwind CSS y estilos personalizados.

---

## Enlace al Sitio de Pruebas

Puedes probar la aplicación frontend en el siguiente enlace:
https://examen-final-wep.netlify.app/

---

## Instrucciones de Instalación y Ejecución

Sigue estos pasos para instalar y ejecutar el frontend localmente:

1. Clona el repositorio:
   ```bash
     https://github.com/axelherreram/front-Sistema-de-Proyectos-de-Software.git
