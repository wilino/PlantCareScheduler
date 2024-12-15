using PlantCareScheduler.Core.Entities;

namespace PlantCareScheduler.Api.DTOs
{
    public class LocationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public LocationDto() { }

        public LocationDto(Location location)
        {
            Id = location.Id;
            Name = location.Name;
        }

        public Location ToEntity()
        {
            return new Location
            {
                Id = Id == Guid.Empty ? Guid.NewGuid() : Id,
                Name = Name
            };
        }
    }
}