namespace LibraryManagement.ViewModel
{
	public class ErrorResponseViewModel
	{
		public int StatusCode { get; set; }
		public string? Message { get; set; }
		public List<string>? Errors { get; set; }
	}
}
