// Test file to run tests locally.
// Run using "runlocal.sh"

define({
	// Browsers to run tests against
	environments: [
		{ browserName: "chrome" }
	],

	// Whether or not to start Sauce Connect before running tests
	useSauceConnect: false,

	// Non-functional test suite(s) to run in each browser
	suites: ["deliteful/tests/intern/unit"],

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	functionalSuites: ["deliteful/tests/intern/functional"],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^(requirejs|dcl|dojo|deliteful\/tests)/
});
