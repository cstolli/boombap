/**
* @Author: Chris Stoll <chrisstoll>
* @Date:   2016-10-08T15:42:27-07:00
* @Email:  chrispstoll@gmail.com
* @Last modified by:   chrisstoll
* @Last modified time: 2016-10-16T21:42:58-07:00
* @License: MIT
*/

module.exports = {
  'framework': 'qunit',
  'test_page': 'tests/index.html?hidepassed',
  'disable_watching': true,
  'launch_in_ci': [
    'Firefox'
  ],
  'launch_in_dev': [
    'Chrome'
  ]
}
