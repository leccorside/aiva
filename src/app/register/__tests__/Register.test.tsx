import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "@/app/register/page";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/users";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/users", () => ({
  registerUser: jest.fn(),
}));

describe("RegisterPage", () => {
  it("preenche formulário e envia corretamente", async () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(
      <ThemeProvider attribute="class">
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </ThemeProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "Fulano" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "fulano@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Fulano",
          email: "fulano@example.com",
          password: "123456",
          role: "customer",
          avatar: "https://i.pravatar.cc/150",
        })
      )
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/login"));
  });
});
