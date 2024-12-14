using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services.Interfaces;


namespace PlantCareScheduler.Services.Imp
{
    public class PlantService : IPlantService
    {
        private readonly IPlantRepository _plantRepository;
        private readonly IPlantCareHistoryRepository _historyRepository;

        public PlantService(IPlantRepository plantRepository, IPlantCareHistoryRepository historyRepository)
        {
            _plantRepository = plantRepository;
            _historyRepository = historyRepository;
        }

        public async Task<DateTime> GetNextWateringDateAsync(Plant plant)
        {
            return await Task.FromResult(plant.LastWateredDate.AddDays(plant.WateringFrequencyDays));
        }

        public async Task<string> GetWateringStatusAsync(Plant plant)
        {
            var nextWateringDate = await GetNextWateringDateAsync(plant);
            var daysUntilNextWatering = (nextWateringDate - DateTime.Now).Days;

            if (daysUntilNextWatering < 0)
                return "Overdue"; // Atrasado
            else if (daysUntilNextWatering <= 3)
                return "Due Soon"; // Próximo
            else
                return "OK"; // En orden
        }

        public async Task<List<Plant>> GetPlantsOrderedByUrgencyAsync()
        {
            var plants = await _plantRepository.GetAllAsync();
            return plants.OrderBy(plant =>
            {
                var nextWateringDate = plant.LastWateredDate.AddDays(plant.WateringFrequencyDays);
                return (nextWateringDate - DateTime.Now).Days; 
            }).ToList();
        }

        public async Task AddPlantAsync(Plant plant)
        {
            await _plantRepository.AddAsync(plant);
        }

        public async Task UpdatePlantAsync(Plant plant)
        {
            await _plantRepository.UpdateAsync(plant);
        }

        public async Task DeletePlantAsync(Guid id)
        {
            await _plantRepository.DeleteAsync(id);
        }

        public async Task<Plant> GetPlantByIdAsync(Guid id)
        {
            return await _plantRepository.GetByIdAsync(id);
        }

        public async Task<List<Plant>> GetAllPlantsAsync()
        {
            return await _plantRepository.GetAllAsync();
        }

        public async Task<string?> GetPlantImageAsync(Guid plantId)
        {
            var plant = await _plantRepository.GetByIdAsync(plantId);
            if (plant == null)
                return null;

            if (!string.IsNullOrEmpty(plant.ImageBase64))
                return plant.ImageBase64;

            if (plant.PlantType != null && !string.IsNullOrEmpty(plant.PlantType.DefaultImageBase64))
                return plant.PlantType.DefaultImageBase64;

            return null;
        }

        public async Task RecordWateringAsync(Guid plantId)
        {
            var plant = await _plantRepository.GetByIdAsync(plantId);
            if (plant == null)
                throw new Exception("Plant not found.");

            plant.LastWateredDate = DateTime.Now;
            await _plantRepository.UpdateAsync(plant);

            var history = new PlantCareHistory
            {
                Id = Guid.NewGuid(),
                PlantId = plantId,
                CareType = "Watering",
                CareDate = DateTime.Now,
                Notes = "Watered"
            };
            await _historyRepository.AddAsync(history);
        }
    }
}