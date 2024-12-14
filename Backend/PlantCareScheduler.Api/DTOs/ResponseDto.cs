namespace PlantCareScheduler.Api.DTOs
{
    public class ResponseDto<T>
    {
        public bool HasErrors { get; set; }
        public List<string> Errors { get; set; }
        public T Data { get; set; }

        public ResponseDto()
        {
            Errors = new List<string>();
        }
    }
}

