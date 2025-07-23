# 🌍 IAventura - Planificador de Viajes con IA

Una aplicación web moderna para planificar viajes utilizando inteligencia artificial, construida con Astro, Tailwind CSS 4 y TypeScript.

## ✨ Características

- **Planificación Inteligente**: Genera itinerarios personalizados basados en las ciudades seleccionadas y duración del viaje
- **Interfaz Moderna**: Diseño responsive con animaciones suaves y efectos visuales atractivos
- **Historial de Viajes**: Guarda automáticamente los viajes planificados en el navegador
- **Múltiples Ciudades**: Permite añadir hasta 5 ciudades por viaje
- **Experiencia Fluida**: Animaciones CSS personalizadas y transiciones suaves

## 🚀 Tecnologías Utilizadas

- **Astro**: Framework web moderno para sitios rápidos
- **Tailwind CSS 4**: Framework de CSS utilitario de última generación
- **TypeScript**: Tipado estático para JavaScript
- **API Routes**: Endpoints internos para la lógica de negocio

## 🎨 Características de Diseño

- Gradientes modernos y efectos glassmorphism
- Animaciones CSS personalizadas (fade-in, slide-in, bounce, pulse)
- Efectos hover interactivos
- Diseño responsive para todos los dispositivos
- Paleta de colores atractiva y profesional

## 📱 Funcionalidades

### Formulario Principal
- Selección de múltiples ciudades
- Configuración de duración del viaje (1-30 días)
- Validación de formularios
- Botones dinámicos para añadir/eliminar ciudades

### Generación de Itinerarios
- API interna que simula llamadas a IA
- Recomendaciones específicas por ciudad
- Distribución inteligente de días por destino
- Sugerencias de monumentos, gastronomía y barrios

### Historial
- Almacenamiento local de viajes planificados
- Visualización en tarjetas interactivas
- Recuperación rápida de itinerarios anteriores
- Límite de 6 viajes más recientes

## 🛠️ Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                        |
| `npm run dev`             | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`           | Construye el sitio para producción en `./dist/` |
| `npm run preview`         | Previsualiza la build localmente                |
| `npm run astro ...`       | Ejecuta comandos CLI como `astro add`, `astro check` |
| `npm run astro -- --help` | Obtiene ayuda usando el CLI de Astro            |

## 🔑 Configuración de OpenAI

Para usar la funcionalidad de generación de itinerarios con IA real:

1. **Obtén tu API Key de OpenAI:**
   - Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
   - Crea una cuenta o inicia sesión
   - Genera una nueva API key

2. **Configura las variables de entorno:**
   - Copia tu API key
   - Abre el archivo `.env` en la raíz del proyecto
   - Reemplaza `your_openai_api_key_here` con tu API key real:
   ```
   OPENAI_API_KEY=sk-tu-api-key-aqui
   ```

3. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

> **⚠️ Importante:** Nunca compartas tu API key públicamente. El archivo `.env` está incluido en `.gitignore` para mantener tu clave segura.

## 📁 Estructura del Proyecto

```
src/
├── pages/
│   ├── index.astro          # Página principal
│   └── api/
│       └── generate-itinerary.ts  # API para generar itinerarios
└── styles/
    └── global.css           # Estilos globales y animaciones
```

## 🎯 Próximas Mejoras

- Integración con APIs reales de viajes
- Mapas interactivos
- Recomendaciones de hoteles y restaurantes
- Exportación de itinerarios a PDF
- Sistema de favoritos
- Compartir viajes en redes sociales

---

**Desarrollado con ❤️ usando Astro y Tailwind CSS**
