import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../page";
import { useAuth } from "@/hooks/useAuth";

// Mock do hook useAuth
jest.mock("@/hooks/useAuth");
const mockedUseAuth = useAuth as jest.Mock;

// Mock do useRouter (Next App Router)
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
    });
  });

  it("renderiza inputs de email e senha", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
  });

  it("exibe mensagem de erro se login falhar", async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error("invalid"));
    mockedUseAuth.mockReturnValueOnce({
      isAuthenticated: false,
      login: mockLogin,
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "admin@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/inválidos/i)).toBeInTheDocument();
  });
});
