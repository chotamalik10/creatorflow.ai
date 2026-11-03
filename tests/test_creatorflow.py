import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "tools" / "creatorflow.py"
SPEC = importlib.util.spec_from_file_location("creatorflow_cli", MODULE_PATH)
CLI = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(CLI)


class ProjectValidationTests(unittest.TestCase):
    def write_json(self, value):
        handle = tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", suffix=".json", delete=False)
        with handle:
            json.dump(value, handle)
        self.addCleanup(Path(handle.name).unlink, missing_ok=True)
        return Path(handle.name)

    def test_accepts_valid_short_project(self):
        path = self.write_json({
            "title": "A useful video",
            "format": "Shorts",
            "script": "Hello world",
            "scenes": [{"name": "Hook"}],
        })
        project = CLI.load_project(path)
        self.assertEqual(project["title"], "A useful video")
        self.assertEqual(len(project["scenes"]), 1)

    def test_rejects_invalid_format(self):
        path = self.write_json({"title": "Test", "format": "Vertical"})
        with self.assertRaisesRegex(ValueError, "format"):
            CLI.load_project(path)

    def test_rejects_malformed_scene(self):
        path = self.write_json({
            "title": "Test",
            "format": "Long-form",
            "scenes": ["not a scene object"],
        })
        with self.assertRaisesRegex(ValueError, "Scene 1"):
            CLI.load_project(path)

    def test_rejects_non_object_json(self):
        path = self.write_json(["not", "an", "object"])
        with self.assertRaisesRegex(ValueError, "JSON object"):
            CLI.load_project(path)


if __name__ == "__main__":
    unittest.main()
