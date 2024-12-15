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
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        /// <summary>
        /// Retrieves all locations.
        /// </summary>
        /// <returns>A list of all locations.</returns>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<List<LocationDto>>>> GetAllLocations()
        {
            try
            {
                var locations = await _locationService.GetAllLocationsAsync();
                var locationDtos = locations.ConvertAll(location => new LocationDto(location));
                return Ok(new ResponseDto<List<LocationDto>> { Data = locationDtos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<List<LocationDto>>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Adds a new location.
        /// </summary>
        /// <param name="locationDto">The location data to be added.</param>
        /// <returns>A confirmation message with the added location details.</returns>
        [HttpPost]
        public async Task<ActionResult<ResponseDto<LocationDto>>> AddLocation([FromBody] LocationDto locationDto)
        {
            if (locationDto == null || string.IsNullOrEmpty(locationDto.Name))
            {
                return BadRequest(new ResponseDto<LocationDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { "Invalid location data." }
                });
            }

            try
            {
                var location = locationDto.ToEntity();
                await _locationService.AddLocationAsync(location);
                locationDto.Id = location.Id;
                return Ok(new ResponseDto<LocationDto> { Data = locationDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDto<LocationDto>
                {
                    HasErrors = true,
                    Errors = new List<string> { ex.Message }
                });
            }
        }
    }
}