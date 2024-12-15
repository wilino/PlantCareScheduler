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
            return plant.LastWateredDate.AddDays(plant.WateringFrequencyDays);
        }

        private double CalculateElapsedPercentage(Plant plant)
        {
            var lastWateredDate = plant.LastWateredDate;
            var nextWateringDate = lastWateredDate.AddDays(plant.WateringFrequencyDays);

            var totalDuration = (nextWateringDate - lastWateredDate).TotalMinutes;
            var elapsedDuration = (DateTime.Now - lastWateredDate).TotalMinutes;

            return (elapsedDuration / totalDuration) * 100;
        }

        public async Task<string> GetWateringStatusAsync(Plant plant)
        {
            var percentageElapsed = CalculateElapsedPercentage(plant);

            if (percentageElapsed >= 100)
            {
                return "Overdue"; // Atrasado
            }
            else if (percentageElapsed >= 70)
            {
                return "Due Soon"; // Próximo
            }
            else
            {
                return "OK"; // En orden
            }
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
            var plant = await _plantRepository.GetByIdAsync(id);

            if (plant != null)
            {
                _ = plant.PlantType;
                _ = plant.Location;

                plant.ImageBase64 = !string.IsNullOrEmpty(plant.ImageBase64)
                    ? plant.ImageBase64
                    : plant.PlantType?.DefaultImageBase64;
            }

            return plant;
        }

        public async Task<List<Plant>> GetAllPlantsAsync()
        {
            var plants = await _plantRepository.GetAllAsync();

            foreach (var plant in plants)
            {
                _ = plant.PlantType;
                _ = plant.Location;

                plant.ImageBase64 = !string.IsNullOrEmpty(plant.ImageBase64)
                    ? plant.ImageBase64
                    : plant.PlantType?.DefaultImageBase64;
            }

            return plants;
        }

        public async Task<string?> GetPlantImageAsync(Guid plantId)
        {
            var plant = await _plantRepository.GetByIdAsync(plantId);
            if (plant == null)
                return null;

            return !string.IsNullOrEmpty(plant.ImageBase64)
                ? plant.ImageBase64
                : plant.PlantType?.DefaultImageBase64;
        }

        public async Task RecordWateringAsync(Guid plantId)
        {
            var plant = await _plantRepository.GetByIdAsync(plantId);
            if (plant == null)
                throw new Exception("Plant not found.");

            var percentageElapsed = CalculateElapsedPercentage(plant);
            string notes;

            if (percentageElapsed >= 100)
            {
                notes = "Watered late";
            }
            else if (percentageElapsed < 100 && percentageElapsed >= 70)
            {
                notes = "Watered on time";
            }
            else
            {
                notes = "Watered too early";
            }

            plant.LastWateredDate = DateTime.Now;
            await _plantRepository.UpdateAsync(plant);

            var history = new PlantCareHistory
            {
                Id = Guid.NewGuid(),
                PlantId = plantId,
                CareType = "Watering",
                CareDate = DateTime.Now,
                Notes = notes
            };

            await _historyRepository.AddAsync(history);
        }
    }
}