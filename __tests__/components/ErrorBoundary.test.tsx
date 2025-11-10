import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error thrown");
  }
  return <div>Child component</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // Suppress console.error during tests to avoid noise
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("Normal rendering", () => {
    it("should render children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      );
      expect(screen.getByText("First child")).toBeInTheDocument();
      expect(screen.getByText("Second child")).toBeInTheDocument();
    });
  });

  describe("Error catching", () => {
    it("should catch errors and display fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      expect(screen.queryByText("Child component")).not.toBeInTheDocument();
    });

    it("should display error message in fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText("Test error thrown")).toBeInTheDocument();
    });

    it("should display Try Again button", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole("button", { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
    });

    it("should display Go to Homepage button", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const homeButton = screen.getByRole("button", {
        name: /go to homepage/i,
      });
      expect(homeButton).toBeInTheDocument();
    });
  });

  describe("Error logging", () => {
    it("should log error to console", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("Fallback UI styling", () => {
    it("should render error UI with proper structure", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText("Test error thrown")).toBeInTheDocument();
    });
  });

  describe("Props handling", () => {
    it("should handle React elements as children", () => {
      render(
        <ErrorBoundary>
          <div data-testid="react-element">React element child</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId("react-element")).toBeInTheDocument();
    });

    it("should handle text as children", () => {
      render(<ErrorBoundary>Plain text child</ErrorBoundary>);

      expect(screen.getByText("Plain text child")).toBeInTheDocument();
    });
  });

  describe("State management", () => {
    it("should initialize with hasError: false", () => {
      render(
        <ErrorBoundary>
          <div>No error</div>
        </ErrorBoundary>
      );

      expect(
        screen.queryByText(/Something went wrong/i)
      ).not.toBeInTheDocument();
    });

    it("should update hasError to true when error occurs", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  describe("Integration scenarios", () => {
    it("should handle nested error boundaries", () => {
      render(
        <ErrorBoundary>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    it("should isolate errors to specific boundary", () => {
      render(
        <div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
          <ErrorBoundary>
            <div>Safe component</div>
          </ErrorBoundary>
        </div>
      );

      // First boundary shows error
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
      // Second boundary still renders children
      expect(screen.getByText("Safe component")).toBeInTheDocument();
    });
  });
});
