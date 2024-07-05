using LibraryManagement.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibraryManagement.ExceptionFilter
{
	public class CustomExceptionFilter : IExceptionFilter
	{
		public void OnException(ExceptionContext context)
		{
			if (context.Exception is CustomException customException)
			{
				var response = new ResponseViewModel
				{
					IsSuccess = false,
					Message = customException.Message
				};

				context.Result = new BadRequestObjectResult(response);
				context.ExceptionHandled = true;
			}
		}
	}
}
