using PlantCareScheduler.Core.Entities;
using System;

namespace PlantCareScheduler.Api.DTOs
{
    public class PlantCareHistoryDto
    {
        public Guid Id { get; set; }
        public Guid PlantId { get; set; }
        public string CareType { get; set; }
        public DateTime CareDate { get; set; }
        public string Notes { get; set; }

        public PlantCareHistoryDto() { }

        public PlantCareHistoryDto(PlantCareHistory history)
        {
            Id = history.Id;
            PlantId = history.PlantId;
            CareType = history.CareType;
            CareDate = history.CareDate;
            Notes = history.Notes;
        }

        public PlantCareHistory ToEntity()
        {
            return new PlantCareHistory
            {
                Id = Id,
                PlantId = PlantId,
                CareType = CareType,
                CareDate = CareDate,
                Notes = Notes
            };
        }
    }
}