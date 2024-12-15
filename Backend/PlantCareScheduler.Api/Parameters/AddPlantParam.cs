using System;
using System.ComponentModel.DataAnnotations;

namespace PlantCareScheduler.Api.Parameters
{
    public class AddPlantParam
    {
        [Required(ErrorMessage = "The plant name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The Plant Type ID is required.")]
        public Guid PlantTypeId { get; set; }

        [Required(ErrorMessage = "The Location ID is required.")]
        public Guid LocationId { get; set; }

        [Range(1, 365, ErrorMessage = "Watering frequency must be between 1 and 365 days.")]
        public int WateringFrequencyDays { get; set; }

        public string? ImageBase64 { get; set; }
    }
}