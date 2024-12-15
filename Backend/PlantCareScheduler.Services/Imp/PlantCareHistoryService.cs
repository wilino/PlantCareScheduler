using System;
using System.Threading.Tasks;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services.Interfaces;

namespace PlantCareScheduler.Services.Imp
{
    public class PlantCareHistoryService : IPlantCareHistoryService
    {
        private readonly IPlantCareHistoryRepository _historyRepository;

        public PlantCareHistoryService(IPlantCareHistoryRepository historyRepository)
        {
            _historyRepository = historyRepository;
        }

        public async Task<List<PlantCareHistory>> GetHistoryByPlantIdAsync(Guid plantId)
        {
            return await _historyRepository.GetHistoryByPlantIdAsync(plantId);
        }

        public async Task AddCareHistoryAsync(Guid plantId, string careType, string notes)
        {
            var history = new PlantCareHistory
            {
                Id = Guid.NewGuid(),
                PlantId = plantId,
                CareType = careType,
                CareDate = DateTime.Now,
                Notes = notes
            };

            await _historyRepository.AddAsync(history);
        }

        public async Task<int> GetPlantsWateredThisWeekAsync()
        {
            var today = DateTime.Today;
            int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
            var startOfWeek = today.AddDays(-diff);
            var endOfWeek = startOfWeek.AddDays(7).AddTicks(-1);
            var histories = await _historyRepository.GetAllAsync();

            var res = histories.Count(h =>
                h.CareDate >= startOfWeek &&
                h.CareDate <= endOfWeek &&
                h.CareType == "Watering"
            );

            return res;
        }
    }
}