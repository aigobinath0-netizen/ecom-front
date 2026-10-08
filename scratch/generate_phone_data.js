import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scratch/phone_models.json', 'utf-8'));

const fileContent = `// All 945 supported phone devices organized by Brand
export const PHONE_MODELS_BY_BRAND = ${JSON.stringify(data.brandCategories, null, 2)};

export const ALL_PHONE_MODELS = ${JSON.stringify(data.devices, null, 2)};

export const PHONE_BRANDS = Object.keys(PHONE_MODELS_BY_BRAND);
`;

fs.writeFileSync('src/phoneModelsData.js', fileContent);
console.log('src/phoneModelsData.js generated successfully! Total devices:', data.devices.length);
