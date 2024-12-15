using Microsoft.AspNetCore.Mvc;
using PlantCareScheduler.Api.DTOs;
using PlantCareScheduler.Api.Parameters;
using PlantCareScheduler.Core.Entities;
using PlantCareScheduler.Services.Interfaces;

namespace PlantCareScheduler.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlantsController : ControllerBase
    {
        private readonly IPlantService _plantService;

        public PlantsController(IPlantService plantService)
        {
            _plantService = plantService;
        }

        /// <summary>
        /// Retrieves all plants in the system.
        /// </summary>
        /// <returns>A list of plants with their details.</returns>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<List<PlantDto>>>> GetAllPlants()
        {
            try
            {
                var plants = await _plantService.GetAllPlantsAsync();
                var plantDtos = plants.ConvertAll(p => new PlantDto(p));
                return Ok(new ResponseDto<List<PlantDto>> { Data = plantDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<List<PlantDto>>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Adds a new plant to the system.
        /// </summary>
        /// <param name="addPlantParam">The parameters required to create a new plant, provided in the request body.</param>
        /// <returns>
        /// An <see cref="ActionResult"/> containing a <see cref="ResponseDto{T}"/> with the details of the created plant 
        /// or an error message if the operation fails.
        /// </returns>
        /// <remarks>
        /// This endpoint expects a valid <see cref="AddPlantParam"/> object in the request body.
        /// If the data is invalid, a 400 Bad Request response is returned with error details.
        /// If the plant is successfully created, a 201 Created response is returned with the plant details.
        /// If there is an internal error, a 500 Internal Server Error response is returned.
        /// </remarks>
        [HttpPost]
        public async Task<ActionResult<ResponseDto<PlantDto>>> AddPlant([FromBody] AddPlantParam param)
        {
            if (param == null)
            {
                return BadRequest(new ResponseDto<PlantDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { "Invalid plant data." }
                });
            }

            try
            {
                var plantDto = new PlantDto
                {
                    Id = Guid.NewGuid(), // Genera un nuevo ID
                    Name = param.Name,
                    PlantTypeId = param.PlantTypeId,
                    LocationId = param.LocationId,
                    WateringFrequencyDays = param.WateringFrequencyDays,
                    ImageBase64 = param.ImageBase64
                };

                var plant = plantDto.ToEntity();
                await _plantService.AddPlantAsync(plant);

                return CreatedAtAction(nameof(GetPlantById), new { id = plant.Id }, new ResponseDto<PlantDto>
                {
                    Data = new PlantDto(plant)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<PlantDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Retrieves details of a specific plant by its ID.
        /// </summary>
        /// <param name="id">The ID of the plant.</param>
        /// <returns>The details of the requested plant.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseDto<PlantDto>>> GetPlantById(Guid id)
        {
            try
            {
                var plant = await _plantService.GetPlantByIdAsync(id);
                if (plant == null)
                {
                    return NotFound(new ResponseDto<PlantDto>
                    {
                        HasErrors = true,
                        Errors = new List<string> { "Plant not found." }
                    });
                }

                return Ok(new ResponseDto<PlantDto> { Data = new PlantDto(plant) });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<PlantDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Records the watering of a specific plant.
        /// </summary>
        /// <param name="id">The ID of the plant to water.</param>
        /// <returns>A confirmation message of the watering.</returns>
        [HttpPut("{id}/water")]
        public async Task<ActionResult<ResponseDto<string>>> RecordWatering(Guid id)
        {
            try
            {
                await _plantService.RecordWateringAsync(id);
                return Ok(new ResponseDto<string> { Data = "Watering recorded successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<string>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Retrieves all plants that are overdue for watering.
        /// </summary>
        /// <returns>A list of plants that need to be watered.</returns>
        [HttpGet("due")]
        public async Task<ActionResult<ResponseDto<List<PlantDto>>>> GetPlantsDueForWatering()
        {
            try
            {
                var plants = await _plantService.GetPlantsOrderedByUrgencyAsync();
                var duePlants = new List<Plant>();

                foreach (var plant in plants)
                {
                    var status = await _plantService.GetWateringStatusAsync(plant);
                    if (status == "Overdue")
                    {
                        duePlants.Add(plant);
                    }
                }

                var plantDtos = duePlants.ConvertAll(p => new PlantDto(p));
                return Ok(new ResponseDto<List<PlantDto>> { Data = plantDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<List<PlantDto>>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Retrieves plants grouped by their location.
        /// </summary>
        /// <returns>A dictionary where the key is the location name and the value is a list of plants in that location.</returns>
        [HttpGet("group-by-location")]
        public async Task<ActionResult<ResponseDto<Dictionary<string, List<PlantDto>>>>> GroupPlantsByLocation()
        {
            try
            {
                var plants = await _plantService.GetAllPlantsAsync();
                var grouped = plants
                    .GroupBy(p => p.Location?.Name ?? "Unknown")
                    .ToDictionary(g => g.Key, g => g.Select(p => new PlantDto(p)).ToList());

                return Ok(new ResponseDto<Dictionary<string, List<PlantDto>>> { Data = grouped });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<Dictionary<string, List<PlantDto>>>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Retrieves the watering status of a specific plant by its ID.
        /// </summary>
        /// <param name="id">The ID of the plant.</param>
        /// <returns>The watering status of the plant.</returns>
        [HttpGet("{id}/status")]
        public async Task<ActionResult<ResponseDto<string>>> GetPlantWateringStatus(Guid id)
        {
            try
            {
                var plant = await _plantService.GetPlantByIdAsync(id);
                if (plant == null)
                {
                    return NotFound(new ResponseDto<string>
                    {
                        HasErrors = true,
                        Errors = new List<string> { "Plant not found." }
                    });
                }

                var status = await _plantService.GetWateringStatusAsync(plant);
                return Ok(new ResponseDto<string> { Data = status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<string>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}