import provinces from '@/api/provinces.json'

export const useProvinces = () =>{
    const provinceOptions = provinces
    .map(province => ({
        id: province.id,
        name: province.name,
    }));

    return {
        provinceOptions,
    }
}