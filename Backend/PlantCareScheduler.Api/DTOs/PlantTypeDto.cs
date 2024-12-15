using PlantCareScheduler.Core.Entities;

namespace PlantCareScheduler.Api.DTOs
{
    public class PlantTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? DefaultImageBase64 { get; set; }

        public PlantTypeDto() { }

        public PlantTypeDto(PlantType plantType)
        {
            Id = plantType.Id;
            Name = plantType.Name;
            Description = plantType.Description;
            DefaultImageBase64 = plantType.DefaultImageBase64;
        }

        public PlantType ToEntity()
        {
            return new PlantType
            {
                Id = Id == Guid.Empty ? Guid.NewGuid() : Id,
                Name = Name,
                Description = Description,
                DefaultImageBase64 = DefaultImageBase64
            };
        }
    }
}