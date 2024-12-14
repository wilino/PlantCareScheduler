using Moq;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Core.Interfaces;
using PlantCareScheduler.Services.Imp;

namespace PlantCareScheduler.Tests.Services
{
    public class PlantServiceTests
    {
        private readonly Mock<IPlantRepository> _plantRepositoryMock;
        private readonly Mock<IPlantCareHistoryRepository> _historyRepositoryMock;
        private readonly PlantService _plantService;

        public PlantServiceTests()
        {
            _plantRepositoryMock = new Mock<IPlantRepository>();
            _historyRepositoryMock = new Mock<IPlantCareHistoryRepository>();
            _plantService = new PlantService(_plantRepositoryMock.Object, _historyRepositoryMock.Object);
        }

        [Fact]
        public async Task GetNextWateringDateAsync_ShouldReturnCorrectNextDate()
        {
            // Arrange
            var plant = new Plant
            {
                Id = Guid.NewGuid(),
                Name = "Test Plant",
                LastWateredDate = DateTime.Now.AddDays(-5),
                WateringFrequencyDays = 7
            };

            // Act
            var nextWateringDate = await _plantService.GetNextWateringDateAsync(plant);

            // Assert
            Assert.Equal(plant.LastWateredDate.AddDays(plant.WateringFrequencyDays), nextWateringDate);
        }

        [Theory]
        [InlineData(-1, "Overdue")]
        [InlineData(0, "Due Soon")]
        [InlineData(3, "Due Soon")]
        [InlineData(5, "OK")]
        public async Task GetWateringStatusAsync_ShouldReturnCorrectStatus(int daysUntilNextWatering, string expectedStatus)
        {
            // Arrange
            var plant = new Plant
            {
                Id = Guid.NewGuid(),
                Name = "Test Plant",
                LastWateredDate = DateTime.Now.AddDays(daysUntilNextWatering * -1),
                WateringFrequencyDays = Math.Abs(daysUntilNextWatering)
            };

            // Act
            var status = await _plantService.GetWateringStatusAsync(plant);

            // Assert
            Assert.Equal(expectedStatus, status);
        }

        [Fact]
        public async Task GetPlantsOrderedByUrgencyAsync_ShouldOrderPlantsByNextWateringDate()
        {
            // Arrange
            var plants = new List<Plant>
                        {
                            new Plant { Id = Guid.NewGuid(), Name = "Plant 1", LastWateredDate = DateTime.Now.AddDays(-5), WateringFrequencyDays = 7 },
                            new Plant { Id = Guid.NewGuid(), Name = "Plant 2", LastWateredDate = DateTime.Now.AddDays(-1), WateringFrequencyDays = 3 },
                            new Plant { Id = Guid.NewGuid(), Name = "Plant 3", LastWateredDate = DateTime.Now.AddDays(-2), WateringFrequencyDays = 2 }
                        };

            _plantRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(plants);

            // Act
            var orderedPlants = await _plantService.GetPlantsOrderedByUrgencyAsync();

            // Assert
            Assert.Collection(orderedPlants,
                plant => Assert.Equal("Plant 3", plant.Name),
                plant => Assert.Equal("Plant 2", plant.Name),
                plant => Assert.Equal("Plant 1", plant.Name));
        }
    }
}

