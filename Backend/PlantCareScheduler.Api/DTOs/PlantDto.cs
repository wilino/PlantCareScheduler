using PlantCareScheduler.Core.Entities;

namespace PlantCareScheduler.Api.DTOs
{
    public class PlantDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid PlantTypeId { get; set; }
        public string PlantTypeName { get; set; }
        public Guid LocationId { get; set; }
        public string LocationName { get; set; }
        public int WateringFrequencyDays { get; set; }
        public DateTime LastWateredDate { get; set; }
        public string Status { get; set; }
        public string? ImageBase64 { get; set; }

        public PlantDto() { }

        public PlantDto(Plant plant)
        {
            Id = plant.Id;
            Name = plant.Name;
            PlantTypeId = plant.PlantTypeId;
            PlantTypeName = plant.PlantType?.Name;
            LocationId = plant.LocationId;
            LocationName = plant.Location?.Name;
            WateringFrequencyDays = plant.WateringFrequencyDays;
            LastWateredDate = plant.LastWateredDate;
            ImageBase64 = plant.ImageBase64 ?? plant.PlantType?.DefaultImageBase64;
        }

        public Plant ToEntity()
        {
            return new Plant
            {
                Id = Id,
                Name = Name,
                PlantTypeId = PlantTypeId,
                LocationId = LocationId,
                WateringFrequencyDays = WateringFrequencyDays,
                LastWateredDate = LastWateredDate
            };
        }
    }
}