namespace PlantCareScheduler.Core.Entities
{
        public class Plant
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public Guid PlantTypeId { get; set; }
            public PlantType PlantType { get; set; }
            public Guid LocationId { get; set; }
            public Location Location { get; set; }
            public int WateringFrequencyDays { get; set; }
            public DateTime LastWateredDate { get; set; }
            public ICollection<PlantCareHistory> CareHistory { get; set; }
            public string? ImageBase64 { get; set; }
        }
    
}

