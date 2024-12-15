using System;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services.Interfaces;

namespace PlantCareScheduler.Services.Imp
{
    public class PlantTypeService : IPlantTypeService
    {
        private readonly IPlantTypeRepository _plantTypeRepository;

        public PlantTypeService(IPlantTypeRepository plantTypeRepository)
        {
            _plantTypeRepository = plantTypeRepository;
        }

        public async Task<List<PlantType>> GetAllPlantTypesAsync()
        {
            return await _plantTypeRepository.GetAllAsync();
        }

        public async Task AddPlantTypeAsync(PlantType plantType)
        {
            await _plantTypeRepository.AddAsync(plantType);
        }
    }
}

