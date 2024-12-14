namespace PlantCareScheduler.Core.Entities
{
    public class PlantType
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? DefaultImageBase64 { get; set; } 
    }
}

