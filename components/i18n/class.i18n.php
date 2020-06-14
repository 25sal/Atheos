<?php

//////////////////////////////////////////////////////////////////////////////80
// i18n Class
//////////////////////////////////////////////////////////////////////////////80
// Copyright (c) Atheos & Liam Siira (Atheos.io), distributed as-is and without
// warranty under the modified License: MIT - Hippocratic 1.2: firstdonoharm.dev
// See [root]/license.md for more. This information must remain intact.
//////////////////////////////////////////////////////////////////////////////80
// Authors: @hlsiira, @Philipp15b (https://github.com/Philipp15b/php-i18n)
//////////////////////////////////////////////////////////////////////////////80
class i18n {

	//////////////////////////////////////////////////////////////////////////80
	// PROPERTIES
	//////////////////////////////////////////////////////////////////////////80

	/**
	* Cache language data
	* This is the path for all the cache files. Best is an empty directory with no other files in it.
	*/
	protected $cache = array();

	/**
	* Fallback language
	* This is the language which is used when there is no language file for all other user languages. It has the lowest priority.
	* Remember to create a language file for the fallback!!
	*/
	protected $fallbackLang = 'en';

	/**
	* Forced language
	* If you want to force a specific language define it here.
	*/
	protected $forcedLang = NULL;


	protected $langCodes = array(
		"en" => "english",
		"fr" => "français",
		"it" => "italiano",
		"ru" => "русский",
		"de" => "deutsch",
		"es" => "español",
		"pt" => "português",
		"ro" => "romanian",
		"hu" => "magyar",
		"sv" => "swedish",
		"cn" => "简体中文",
		"pl" => "polish",
		"cz" => "česky",
		"sk" => "slovak",
		"sr" => "српски",
		"bg" => "Български",
		"tr" => "Türkçe",
		"ja" => "日本語",
		"nl" => "Nederlands"
	);


	//////////////////////////////////////////////////////////////////////////80
	// The following properties are only available after calling init().
	//////////////////////////////////////////////////////////////////////////80

	/**
	* User languages
	* These are the languages the user uses, in order:
	* 1. Forced language
	* 2. Language in $_SESSION['lang']
	* 3. Fallback language
	*/
	protected $userLangs = array();
	protected $appliedLang = NULL;


	//////////////////////////////////////////////////////////////////////////80
	// METHODS
	//////////////////////////////////////////////////////////////////////////80

	// ----------------------------------||---------------------------------- //

	//////////////////////////////////////////////////////////////////////////80
	// Construct
	//////////////////////////////////////////////////////////////////////////80
	public function __construct($fallbackLang = NULL, $forcedLang = NULL) {
		// Apply settings
		if ($fallbackLang !== NULL) {
			$this->fallbackLang = $fallbackLang;
		}
		if ($forcedLang !== NULL) {
			$this->forcedLang = $forcedLang;
		}
	}

	//////////////////////////////////////////////////////////////////////////80
	// Init
	//////////////////////////////////////////////////////////////////////////80
	public function init() {
		$this->userLangs = $this->getUserLangs();

		// search for language file
		$this->appliedLang = NULL;

		foreach ($this->userLangs as $priority => $langcode) {
			if (file_exists($this->getLangFileName($langcode))) {
				$this->appliedLang = $langcode;
				break;
			}
		}

		if ($this->appliedLang == NULL) {
			throw new RuntimeException('No language file was found.');
		}

		// search for cache file
		$cacheFilePath = __DIR__ . '/cache/i18n_' . $this->appliedLang . '.cache.php';

		// whether we need to create a new cache file
		$outdated = false;
		if (!file_exists($cacheFilePath)) {
			$outdated = true;
		} else {
			$mCache = filemtime($cacheFilePath);
			$mPlang = filemtime($this->getLangFileName($this->appliedLang));
			$mFlang = filemtime($this->getLangFileName($this->fallbackLang));

			if ($mCache < $mPlang) {
				// the language config was updated
				$outdated = true;
			} elseif ($mCache < $mFlang) {
				// the fallback language config was updated
				$outdated = true;
			}

		}

		if ($outdated || true) {
			$appliedData = $this->load($this->appliedLang);
			$fallbackData = $this->load($this->fallbackLang);
			$mergedData = array_replace_recursive($fallbackData, $appliedData);

			$compiled = "<?php\n"
			. "return array(\n"
			. $this->compile($mergedData)
			. ");\n"
			. "?>";

			if (!is_dir(__DIR__ . '/cache/')) {
				mkdir(__DIR__ . '/cache/', 0755, true);
			}
			if (file_put_contents($cacheFilePath, $compiled) === FALSE) {
				throw new Exception("Could not create langauge cache");
			}
			chmod($cacheFilePath, 0755);

		}

		$this->cache = require_once $cacheFilePath;
	}

	//////////////////////////////////////////////////////////////////////////80
	// Translate
	//////////////////////////////////////////////////////////////////////////80
	public function translate($string, $args = NULL) {
		$result = array_key_exists($string, $this->cache) ? $this->cache[$string] : $string;
		if(array_key_exists($string, $this->cache)) {
			$result = $this->cache[$string];
		} else {
			$result = $string;
			$this->debug($string);
		}
		return $args ? vsprintf($result, $args) : $result;
	}

	function debug($val) {
		$path = __DIR__ . "/missing.log";
		$path = preg_replace('#/+#', '/', $path);

		$time = date("Y-m-d H:i:s");

		$trace = debug_backtrace(null, 5);

		$function = $trace[1]['function'];
		$file = $trace[2]['file'];

		$val = "\"$val\"";
		$val = str_pad($val, 40, ".", STR_PAD_RIGHT);
		$function = str_pad($function, 10, ".", STR_PAD_RIGHT);

		$text = "@$time:\t$val < $function in $file" . PHP_EOL;

		if (file_exists($path)) {
			$lines = file($path);
			if (sizeof($lines) > 100) {
				unset($lines[0]);
			}
			$lines[] = $text;

			$write = fopen($path, 'w');
			fwrite($write, implode('', $lines));
			fclose($write);
		} else {
			$write = fopen($path, 'w');
			fwrite($write, $text);
			fclose($write);
		}
	}

	//////////////////////////////////////////////////////////////////////////80
	// Get/Set Applied Language
	//////////////////////////////////////////////////////////////////////////80
	public function appliedLang($val = false) {
		$this->appliedLang = $val ?: $this->appliedLang;
		return $this->appliedLang;
	}

	//////////////////////////////////////////////////////////////////////////80
	// Get/Set Fallback Language
	//////////////////////////////////////////////////////////////////////////80
	public function fallbackLang($val = false) {
		$this->fallbackLang = $val ?: $this->appliedLang;
		return $this->fallbackLang;
	}

	//////////////////////////////////////////////////////////////////////////80
	// Get/Set Forced Language
	//////////////////////////////////////////////////////////////////////////80
	public function forcedLang($val = false) {
		$this->forcedLang = $val ?: $this->forcedLang;
		return $this->forcedLang;
	}

	//////////////////////////////////////////////////////////////////////////80
	// Get user langauges by priorty: Forced, Session, Fallback
	//////////////////////////////////////////////////////////////////////////80
	public function getUserLangs() {
		$userLangs = array();

		// Highest priority: forced language
		if ($this->forcedLang !== NULL) {
			$userLangs[] = $this->forcedLang;
		}

		// 2nd highest priority: SESSION parameter 'lang'
		if (isset($_SESSION['lang']) && is_string($_SESSION['lang'])) {
			$userLangs[] = $_SESSION['lang'];
		}

		// Lowest priority: fallback
		$userLangs[] = $this->fallbackLang;

		// remove duplicate elements
		$userLangs = array_unique($userLangs);

		return $userLangs;
	}

	public function getCache() {
		return $this->cache;
	}

	//////////////////////////////////////////////////////////////////////////80
	// Return filename for language data file
	//////////////////////////////////////////////////////////////////////////80
	protected function getLangFileName($code) {
		return str_replace('{LANGUAGE}', $code, __DIR__ . "/lang/{LANGUAGE}.json");
	}

	//////////////////////////////////////////////////////////////////////////80
	// Load language file code
	//////////////////////////////////////////////////////////////////////////80
	protected function load($code) {
		$filename = $this->getLangFileName($code);
		return json_decode(file_get_contents($filename), true);
	}

	public function codes() {
		return $this->langCodes;
	}

	/**
	* Recursively compile an associative array to PHP code.
	*/
	protected function compile($config, $prefix = '') {
		$code = "";
		foreach ($config as $key => $value) {
			if (is_array($value)) {
				$code .= $this->compile($value, $prefix . $key . "_");
			} elseif (preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $key) || $key === "") {
				$key = rtrim($prefix . $key, "_");
				$code .= "\t\"$key\" => \"" . str_replace('\'', '\\\'', $value) . "\",\n";
			}
		}
		return $code;
	}
}