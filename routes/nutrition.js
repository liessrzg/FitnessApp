const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/nutrition', async (req, res) => {
    const query = req.query.query.toLowerCase();

    try {
        const response = await axios.get('https://world.openfoodfacts.org/cgi/search.pl', {
            params: {
                search_terms: query,
                search_simple: 1,
                action: 'process',
                json: 1
            }
        });

        const products = response.data.products;

        if (products.length > 0) {
            // Trier les produits par pertinence
            const filteredProducts = products.filter(product => 
                product.product_name && product.product_name.toLowerCase().includes(query)
            ).sort((a, b) => {
                return a.product_name.toLowerCase().includes(query) ? -1 : 1;
            });

            const relevantProducts = filteredProducts.slice(0, 10); // Limiter les résultats à 10 produits pertinents
            const results = relevantProducts.map(product => ({
                name: product.product_name,
                image: product.image_url || null,
                calories: product.nutriments['energy-kcal_100g'] || 'Non disponible',
                proteins: product.nutriments['proteins_100g'] || 'Non disponible',
                carbs: product.nutriments['carbohydrates_100g'] || 'Non disponible',
                fats: product.nutriments['fat_100g'] || 'Non disponible'
            }));

            return res.json(results);
        }
        res.status(404).json({ error: 'Produit non trouvé' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des informations nutritionnelles');
    }
});

module.exports = router;
