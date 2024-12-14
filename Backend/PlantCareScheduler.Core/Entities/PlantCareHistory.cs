namespace PlantCareScheduler.Core.Entities
{
    public class PlantCareHistory
    {
        public Guid Id { get; set; }
        public Guid PlantId { get; set; }
        public Plant Plant { get; set; }
        public DateTime CareDate { get; set; }
        public string CareType { get; set; }
        public string Notes { get; set; }
    }
}

