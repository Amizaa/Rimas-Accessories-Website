import cities from '@/api/cities.json'

export const useCity = (id) =>{

    const CityOptions = cities
    .filter(city => city.province_id === id)
    .map(city => city.name);

    return {
        CityOptions,
    }
}