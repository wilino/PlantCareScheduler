using Microsoft.AspNetCore.Mvc;
using PlantCareScheduler.Api.DTOs;
using PlantCareScheduler.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PlantCareScheduler.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlantCareHistoryController : ControllerBase
    {
        private readonly IPlantCareHistoryService _historyService;

        public PlantCareHistoryController(IPlantCareHistoryService historyService)
        {
            _historyService = historyService;
        }

        /// <summary>
        /// Retrieves the care history for a specific plant.
        /// </summary>
        /// <param name="plantId">The ID of the plant.</param>
        /// <returns>A list of care history records for the plant.</returns>
        [HttpGet("{plantId}")]
        public async Task<ActionResult<ResponseDto<List<PlantCareHistoryDto>>>> GetHistoryByPlantId(Guid plantId)
        {
            try
            {
                var histories = await _historyService.GetHistoryByPlantIdAsync(plantId);
                var historyDtos = histories.ConvertAll(h => new PlantCareHistoryDto(h));
                return Ok(new ResponseDto<List<PlantCareHistoryDto>> { Data = historyDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<List<PlantCareHistoryDto>>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Adds a new care history record for a specific plant.
        /// </summary>
        /// <param name="careHistoryDto">The care history data to be added.</param>
        /// <returns>A confirmation message with the added history details.</returns>
        [HttpPost]
        public async Task<ActionResult<ResponseDto<PlantCareHistoryDto>>> AddCareHistory([FromBody] PlantCareHistoryDto careHistoryDto)
        {
            if (careHistoryDto == null)
            {
                return BadRequest(new ResponseDto<PlantCareHistoryDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { "Invalid care history data." }
                });
            }

            try
            {
                await _historyService.AddCareHistoryAsync(careHistoryDto.PlantId, careHistoryDto.CareType, careHistoryDto.Notes);
                return Ok(new ResponseDto<PlantCareHistoryDto>
                {
                    Data = careHistoryDto
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<PlantCareHistoryDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Retrieves the number of plants watered this week.
        /// </summary>
        /// <returns>The count of plants watered this week.</returns>
        [HttpGet("stats/watered-this-week")]
        public async Task<ActionResult<ResponseDto<int>>> GetPlantsWateredThisWeek()
        {
            try
            {
                var count = await _historyService.GetPlantsWateredThisWeekAsync();
                return Ok(new ResponseDto<int> { Data = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<int>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}