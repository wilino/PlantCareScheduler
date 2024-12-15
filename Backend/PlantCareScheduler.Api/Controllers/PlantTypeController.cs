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
    public class PlantTypeController : ControllerBase
    {
        private readonly IPlantTypeService _plantTypeService;

        public PlantTypeController(IPlantTypeService plantTypeService)
        {
            _plantTypeService = plantTypeService;
        }

        /// <summary>
        /// Retrieves all plant types.
        /// </summary>
        /// <returns>A list of all plant types.</returns>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<List<PlantTypeDto>>>> GetAllPlantTypes()
        {
            try
            {
                var plantTypes = await _plantTypeService.GetAllPlantTypesAsync();
                var plantTypeDtos = plantTypes.ConvertAll(pt => new PlantTypeDto(pt));
                return Ok(new ResponseDto<List<PlantTypeDto>> { Data = plantTypeDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<List<PlantTypeDto>>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Adds a new plant type.
        /// </summary>
        /// <param name="plantTypeDto">The plant type data to be added.</param>
        /// <returns>A confirmation message with the added plant type details.</returns>
        [HttpPost]
        public async Task<ActionResult<ResponseDto<PlantTypeDto>>> AddPlantType([FromBody] PlantTypeDto plantTypeDto)
        {
            if (plantTypeDto == null || string.IsNullOrEmpty(plantTypeDto.Name))
            {
                return BadRequest(new ResponseDto<PlantTypeDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { "Invalid plant type data." }
                });
            }

            try
            {
                var plantType = plantTypeDto.ToEntity();

                await _plantTypeService.AddPlantTypeAsync(plantType);
                plantTypeDto.Id = plantType.Id;
                return Ok(new ResponseDto<PlantTypeDto> { Data = plantTypeDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<PlantTypeDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}