import OpenAI from 'openai';

export const prerender = false;

// Tipos específicos para el itinerario
type Monument = {
  name: string;
  location: string;
};

type GastronomyItem = {
  dish: string;
  restaurants: string[];
};

type City = {
  name: string;
  days: string;
  monuments: Monument[];
  gastronomy: GastronomyItem[];
  neighborhoods: string[];
};

type ItineraryData = {
  cities: City[];
};

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST = async ({ request }: { request: Request }) => {
  let cities: string[] = [];
  let days: number = 0;
  
  try {
    const requestData = await request.json();
    cities = requestData.cities;
    days = requestData.days;
    
    // Validar que tenemos la API key
    if (!import.meta.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY no está configurada');
    }
    
    // Crear el prompt optimizado para ChatGPT que devuelva JSON
    const prompt = `Itinerario ${days} días: ${cities.join(', ')}.

Respuesta JSON únicamente:
{
  "cities": [
    {
      "name": "Madrid",
      "days": "Días 1-2",
      "monuments": [
        {"name": "Museo del Prado", "location": "Paseo del Prado"}
      ],
      "gastronomy": [
        {"dish": "Cocido madrileño", "restaurants": ["Casa Carola", "La Bola", "Lhardy"]}
      ],
      "neighborhoods": ["Malasaña", "Chueca", "La Latina"]
    }
  ]
}

Solo JSON válido.`;
    
    // Llamada a la API de OpenAI
     const completion = await openai.chat.completions.create({
       model: "gpt-4o-mini",
       messages: [
         {
           role: "system",
           content: "Eres un asistente que responde solo con JSON válido. No añadas texto antes o después del JSON."
         },
         {
           role: "user",
           content: prompt
         }
       ],
       max_tokens: 1200,
       temperature: 0.1,
     });
    
    const rawResponse = completion.choices[0]?.message?.content || 'No se pudo generar el itinerario';
    
    // Parsear la respuesta JSON de OpenAI
     let itineraryData: ItineraryData;
     try {
       // Limpiar la respuesta de posibles caracteres extra
       let cleanResponse = rawResponse.trim();
       
       // Buscar el primer { y el último }
       const firstBrace = cleanResponse.indexOf('{');
       const lastBrace = cleanResponse.lastIndexOf('}');
       
       if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
         cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
       }
       
       itineraryData = JSON.parse(cleanResponse) as ItineraryData;
     } catch (parseError) {
       console.error('Error parsing JSON:', rawResponse);
       throw new Error('La respuesta de OpenAI no es un JSON válido');
     }
    
    // Formatear los datos en HTML con mejor espaciado y modales
    let formattedItinerary = '<div class="space-y-8">';
    
    itineraryData.cities.forEach((city: City, cityIndex: number) => {
      formattedItinerary += `
        <div class="border-l-4 border-blue-500 pl-8 py-6 bg-blue-50 rounded-r-lg shadow-sm">
          <h3 class="text-2xl font-bold text-blue-800 mb-3">📍 ${city.name}</h3>
          <p class="text-blue-600 mb-6 text-lg">${city.days}</p>
          
          <div class="space-y-6">
            <div>
              <h4 class="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <span class="text-xl">🏛️</span>
                <span>Monumentos</span>
              </h4>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-6">
                ${city.monuments.map((monument: Monument, monumentIndex: number) => `
                  <li class="leading-relaxed">
                    <button class="text-blue-600 hover:text-blue-800 underline cursor-pointer" onclick="openMonumentModal('${city.name}', '${monument.name}', '${monument.location}')">
                      ${monument.name}
                    </button>
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div>
              <h4 class="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <span class="text-xl">🍽️</span>
                <span>Gastronomía</span>
              </h4>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-6">
                ${city.gastronomy.map((food: GastronomyItem, foodIndex: number) => `
                  <li class="leading-relaxed">
                    <button class="text-green-600 hover:text-green-800 underline cursor-pointer" onclick="openGastronomyModal('${food.dish}', ${JSON.stringify(food.restaurants).replace(/"/g, '&quot;')})">
                      ${food.dish}
                    </button>
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div>
              <h4 class="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <span class="text-xl">🚶‍♂️</span>
                <span>Barrios</span>
              </h4>
              <ul class="list-disc list-inside text-gray-700 space-y-2 ml-6">
                ${city.neighborhoods.map((neighborhood: string) => `<li class="leading-relaxed">${neighborhood}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    });
    
    formattedItinerary += '</div>';
    
    return new Response(JSON.stringify({ 
      success: true, 
      itinerary: formattedItinerary,
      message: 'Itinerario generado exitosamente con IA'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error al generar itinerario:', error);
    
    // Sistema de fallback: usar simulación cuando falla OpenAI
    if (error instanceof Error && (error.message.includes('insufficient_quota') || error.message.includes('rate_limit'))) {
      console.log('Usando fallback debido a límite de cuota');
      
      // Generar itinerario básico como fallback
      const daysPerCity = Math.ceil(days / cities.length);
      let fallbackItinerary = '<div class="space-y-8">';
      
      cities.forEach((city: string, index: number) => {
        const startDay = index * daysPerCity + 1;
        const endDay = Math.min((index + 1) * daysPerCity, days);
        
        fallbackItinerary += `
          <div class="border-l-4 border-blue-500 pl-8 py-6 bg-blue-50 rounded-r-lg shadow-sm">
            <h3 class="text-2xl font-bold text-blue-800 mb-3">📍 ${city}</h3>
            <p class="text-blue-600 mb-6 text-lg">Días ${startDay}${endDay > startDay ? `-${endDay}` : ''}</p>
            
            <div class="space-y-6">
              <div>
                <h4 class="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <span class="text-xl">🏛️</span>
                  <span>Monumentos</span>
                </h4>
                <ul class="list-disc list-inside text-gray-700 space-y-2 ml-6">
                  <li class="leading-relaxed">
                    <button class="text-blue-600 hover:text-blue-800 underline cursor-pointer" onclick="openMonumentModal('${city}', 'Principales monumentos', 'Centro histórico')">
                      Principales monumentos y sitios históricos
                    </button>
                  </li>
                  <li class="leading-relaxed">
                    <button class="text-blue-600 hover:text-blue-800 underline cursor-pointer" onclick="openMonumentModal('${city}', 'Museos y galerías', 'Zona cultural')">
                      Museos y galerías de arte
                    </button>
                  </li>
                  <li class="leading-relaxed">
                    <button class="text-blue-600 hover:text-blue-800 underline cursor-pointer" onclick="openMonumentModal('${city}', 'Arquitectura emblemática', 'Centro de la ciudad')">
                      Arquitectura emblemática
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <span class="text-xl">🍽️</span>
                  <span>Gastronomía</span>
                </h4>
                <ul class="list-disc list-inside text-gray-700 space-y-2 ml-6">
                  <li class="leading-relaxed">
                    <button class="text-green-600 hover:text-green-800 underline cursor-pointer" onclick="openGastronomyModal('Platos típicos locales', ['Restaurante Local 1', 'Restaurante Local 2', 'Restaurante Local 3'])">
                      Platos típicos locales
                    </button>
                  </li>
                  <li class="leading-relaxed">
                    <button class="text-green-600 hover:text-green-800 underline cursor-pointer" onclick="openGastronomyModal('Mercados tradicionales', ['Mercado Central', 'Mercado de Abastos', 'Mercado Gourmet'])">
                      Mercados tradicionales
                    </button>
                  </li>
                  <li class="leading-relaxed">
                    <button class="text-green-600 hover:text-green-800 underline cursor-pointer" onclick="openGastronomyModal('Restaurantes recomendados', ['Restaurante Premium 1', 'Restaurante Premium 2', 'Restaurante Premium 3'])">
                      Restaurantes recomendados
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <span class="text-xl">🚶‍♂️</span>
                  <span>Barrios</span>
                </h4>
                <ul class="list-disc list-inside text-gray-700 space-y-2 ml-6">
                  <li class="leading-relaxed">Centro histórico</li>
                  <li class="leading-relaxed">Barrios modernos y trendy</li>
                  <li class="leading-relaxed">Zonas comerciales</li>
                </ul>
              </div>
            </div>
          </div>
        `;
      });
      
      fallbackItinerary += '</div>';
      
      return new Response(JSON.stringify({ 
        success: true, 
        itinerary: fallbackItinerary,
        message: 'Itinerario generado (modo básico - cuota de IA agotada)'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Mensaje de error más específico para otros errores
    let errorMessage = 'Error al generar el itinerario';
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        errorMessage = 'API key de OpenAI no configurada. Por favor, añade tu OPENAI_API_KEY al archivo .env';
      } else if (error.message.includes('invalid_api_key')) {
        errorMessage = 'API key de OpenAI inválida. Por favor, verifica tu OPENAI_API_KEY en el archivo .env';
      }
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};