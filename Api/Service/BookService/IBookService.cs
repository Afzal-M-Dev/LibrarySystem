using LibraryManagement.ViewModel;

namespace LibraryManagement.Service.BookService
{
	public interface IBookService
	{
		Task<ResponseViewModel> AddBook(AddBookViewModel bookViewModel);
		Task<ResponseViewModel> GetBookById(string baseUri, string id);
		Task<ResponseViewModel> GetBookCountsForLibrarian();
		Task<ResponseViewModel> DeleteBook(string bookId);
		Task<ResponseViewModel> UpdateBook(AddBookViewModel bookDTO);
		Task<ResponseViewModel> CheckOutBook(string bookId, string userId);
		Task<ResponseViewModel> ReturnBook(string bookId, string userId);
		Task<ResponseViewModel> GetBookCountsForCustomer(string customerId);
		Task<ResponseViewModel> CheckOutBookDataTable(int start = 0, int length = 10, string? sortColumnName = "", string? sortDirection = "", string? searchValue = "", string baseuri = "", string? customerId = "");
		Task<ResponseViewModel> BookDataTable(int start = 0, int length = 10, string? sortColumnName = "", string? sortDirection = "", string? searchValue = "", string baseuri = "");
	}
}
