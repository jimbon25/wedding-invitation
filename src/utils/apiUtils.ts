// Utility untuk mendeteksi environment dan memberikan endpoint yang sesuai
export const getApiEndpoint = (endpoint: string): string => {
  // Deteksi apakah running di Vercel
  const isVercel = process.env.VERCEL === '1' || window.location.hostname.includes('vercel.app');
  
  // Jika di Vercel, gunakan /api routes
  if (isVercel) {
    // Ambil nama endpoint tanpa path Netlify
    const endpointName = endpoint.replace('/.netlify/functions/', '');
    return `/api/${endpointName}`;
  }
  
  // Jika di Netlify atau local development, gunakan path Netlify functions
  return endpoint.startsWith('/.netlify') ? endpoint : `/.netlify/functions/${endpoint}`;
};
