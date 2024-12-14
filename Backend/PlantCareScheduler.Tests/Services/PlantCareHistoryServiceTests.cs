using Moq;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services;
using PlantCareScheduler.Services.Imp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace PlantCareScheduler.Tests.Services
{
    public class PlantCareHistoryServiceTests
    {
        private readonly Mock<IPlantCareHistoryRepository> _historyRepositoryMock;
        private readonly PlantCareHistoryService _historyService;

        public PlantCareHistoryServiceTests()
        {
            _historyRepositoryMock = new Mock<IPlantCareHistoryRepository>();
            _historyService = new PlantCareHistoryService(_historyRepositoryMock.Object);
        }

        [Fact]
        public async Task GetHistoryByPlantIdAsync_ShouldReturnHistoryForGivenPlantId()
        {
            // Arrange
            var plantId = Guid.NewGuid();
            var histories = new List<PlantCareHistory>
            {
                new PlantCareHistory { Id = Guid.NewGuid(), PlantId = plantId, CareType = "Watering", CareDate = DateTime.Now, Notes = "Watered well" },
                new PlantCareHistory { Id = Guid.NewGuid(), PlantId = plantId, CareType = "Fertilizing", CareDate = DateTime.Now.AddDays(-1), Notes = "Added fertilizer" }
            };

            _historyRepositoryMock.Setup(repo => repo.GetHistoryByPlantIdAsync(plantId)).ReturnsAsync(histories);

            // Act
            var result = await _historyService.GetHistoryByPlantIdAsync(plantId);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, h => Assert.Equal(plantId, h.PlantId));
        }

        [Fact]
        public async Task AddCareHistoryAsync_ShouldAddNewCareHistory()
        {
            // Arrange
            var plantId = Guid.NewGuid();
            var careType = "Watering";
            var notes = "Test watering";
            var history = new PlantCareHistory
            {
                Id = Guid.NewGuid(),
                PlantId = plantId,
                CareType = careType,
                CareDate = DateTime.Now,
                Notes = notes
            };

            _historyRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<PlantCareHistory>())).Returns(Task.CompletedTask);

            // Act
            await _historyService.AddCareHistoryAsync(plantId, careType, notes);

            // Assert
            _historyRepositoryMock.Verify(repo => repo.AddAsync(It.Is<PlantCareHistory>(h =>
                h.PlantId == plantId &&
                h.CareType == careType &&
                h.Notes == notes)), Times.Once);
        }

        [Fact]
        public async Task GetPlantsWateredThisWeekAsync_ShouldReturnCorrectCount()
        {
            // Arrange
            var startOfWeek = DateTime.Now.AddDays(-(int)DateTime.Now.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);
            var histories = new List<PlantCareHistory>
                            {
                                new PlantCareHistory { Id = Guid.NewGuid(), PlantId = Guid.NewGuid(), CareType = "Watering", CareDate = startOfWeek.AddDays(1) },
                                new PlantCareHistory { Id = Guid.NewGuid(), PlantId = Guid.NewGuid(), CareType = "Watering", CareDate = startOfWeek.AddDays(2) },
                                new PlantCareHistory { Id = Guid.NewGuid(), PlantId = Guid.NewGuid(), CareType = "Fertilizing", CareDate = startOfWeek.AddDays(3) }
                            };

            _historyRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(histories);

            // Act
            var count = await _historyService.GetPlantsWateredThisWeekAsync();

            // Assert
            Assert.Equal(2, count); 
        }
    }
}